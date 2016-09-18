<?php

namespace AppBundle\Stuff;

use AppBundle\Entity\SertAction;
use AppBundle\Entity\SertState;
use Doctrine\ORM\EntityManager;
use Doctrine\ORM\Internal\Hydration\HydrationException;
use Doctrine\ORM\Query\ResultSetMapping;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorage;

use AppBundle\Entity\User;
use AppBundle\Entity\Sertificate;

class CertificateStuff
{
    /**
     * @var EntityManager
     */
    private $em;

    /**
     * @var TokenStorage
     */
    private $tokens;

    /**
     * @var SmsStuff
     */
    private $smser;

    public function __construct(EntityManager $em, TokenStorage $tokenStorage, SmsStuff $smser)
    {
        $this->em = $em;
        $this->tokens = $tokenStorage;
        $this->smser = $smser;
    }

    /**
     * certificates - массив сертификатов, упорядоченный по полю группировки
     * group_callback - функция, принимающая сертификат как параметр и возвращающая значение, по которому нужно сгрупировать
     * @param $certificates Sertificate[]
     * @param $group_callback callable
     * @return array
     */
    public function groupCertificatesBy($certificates, $group_callback)
    {
        $result = array();

        if (count($certificates) <= 0){
            return array();
        }

        $prev_dealer = $group_callback($certificates[0]);//$certificates[0]->getUser()->getUsername();
        $result[$prev_dealer] = array();

        foreach ($certificates as $certificate){
            if ($certificate->getUser()->getUsername() != $prev_dealer){
                $prev_dealer = $group_callback($certificate);//$certificate->getUser()->getUsername();
                $result[$prev_dealer] = array();
            }
            array_push($result[$prev_dealer], $certificate);
        }
        return $result;
    }

    /**
     * @param $mentor_id
     * @return Sertificate[]
     */
    public function getCertificatesByMentor($mentor_id, $state_id = -1)
    {
        $query_sql = "SELECT
            rosaviator.sertificate.ID_Sertificate,
            rosaviator.sertificate.name,
            rosaviator.sertificate.last_name,
            rosaviator.sertificate.phone_number,
            
            rosaviator.flight_type.ID_FlightType,
            rosaviator.flight_type.name AS `flight_name`,
            rosaviator.flight_type.price AS `flight_price`,
            rosaviator.flight_type.description_link AS `flight_link`,
            
            rosaviator.user.ID_User,
            rosaviator.user.username
        FROM
            sertificate
            
        LEFT OUTER JOIN 
            flight_type
        ON
            flight_type.ID_FlightType = sertificate.ID_FlightType
            
        LEFT OUTER JOIN
            `user`
        ON
            rosaviator.user.ID_User = rosaviator.sertificate.ID_User          
            
        WHERE
            (sertificate.ID_User IN (
                SELECT
                    user.ID_User
                FROM
                    user
                WHERE
                    user.ID_Mentor = :mentor_id
            ))";

        $params = array(
            "mentor_id" => $mentor_id,
        );
        //If user specified state_id, then we should add another condition to WHERE
        if ($state_id > 0 ){
            $query_sql .= "AND (sertificate.ID_SertState = :state_id)";
            $params["state_id"] = $state_id;
        }

        $query_sql .= " ORDER BY username, ID_Sertificate";

        //Map results to entities
        $rsm = new ResultSetMapping();

        $rsm->addEntityResult("AppBundle:Sertificate", "certificate");
        $rsm->addFieldResult("certificate", "ID_Sertificate", "ID_Sertificate");
        $rsm->addFieldResult("certificate", "name", "name");
        $rsm->addFieldResult("certificate", "last_name", "last_name");
        $rsm->addFieldResult("certificate", "phone_number", "phone_number");

        $rsm->addJoinedEntityResult("AppBundle:FlightType", "flight_type", "certificate", "ID_FlightType");
        $rsm->addFieldResult("flight_type", "ID_FlightType", "ID_FlightType");
        $rsm->addFieldResult("flight_type", "flight_name", "name");
        $rsm->addFieldResult("flight_type", "flight_price", "price");
        $rsm->addFieldResult("flight_type", "flight_link", "description_link");

        $rsm->addJoinedEntityResult("AppBundle:User", "user", "certificate", "ID_User");
        $rsm->addFieldResult("user", "ID_User", "ID_User");
        $rsm->addFieldResult("user", "username", "username");

        //Execute query and fetch results
        $query = $this->em->createNativeQuery($query_sql, $rsm);
        $query->setParameters($params);
        $query_result = $query->getResult();

        return $query_result;
    }

    /**
     * @param $state_id
     * @return array
     */
    public function getAvailableActions($state_id)
    {
        /**
         * @var $query_result SertAction[]
         */
        $query_sql = "SELECT
            sertaction.ID_ActionName AS `ID_ActionName`,
            sertaction.display_name AS `display_name`,
            sertaction.icon AS `icon`
        FROM
            groups_actions
        INNER JOIN(
            SELECT
                *
            FROM
                states_actions
            WHERE
                states_actions.ID_SertState = :ID_SertState
        ) AS allowed_actions
        ON
            allowed_actions.ID_ActionName = groups_actions.ID_ActionName
        LEFT JOIN
            sertaction
        ON
            groups_actions.ID_ActionName = sertaction.ID_ActionName
        WHERE
            ID_UserGroup = :ID_UserGroup
        ORDER BY 
            sertaction.ID_ActionName";

        $rsm = new ResultSetMapping();
        $rsm->addEntityResult("AppBundle:SertAction", "action");
        $rsm->addFieldResult("action", "ID_ActionName", "action_name");
        $rsm->addFieldResult("action", "display_name", "display_name");
        $rsm->addFieldResult("action", "icon", "icon");

        $query = $this->em->createNativeQuery($query_sql, $rsm);
        $query->setParameters(array(
            "ID_SertState" => $state_id,
            "ID_UserGroup" => $this->tokens->getToken()->getUser()->getUserGroup()->getIDUserGroup(),
        ));
        $query_result = $query->getResult();

        return $query_result;
    }

    /**
     * @param $certificate Sertificate
     */
    public function activateCertificate($certificate)
    {
        /** @var $activ_state SertState */
        $activ_state = $this->em->getRepository("AppBundle:SertState")->find(5);
        $certificate->setIDSertState($activ_state);

        $this->em->persist($certificate);
        $this->em->flush();

        $sms_text = "Ваш сертификат №".$certificate->getIDSertificate()." активирован! До встречи в небе =]";
        $sms_phone = $certificate->getPhoneNumber();
        $sms_stuff = $this->smser->sendSms($sms_phone, $sms_text);
    }

    /**
     * @param $certificates Sertificate[]
     */
    public function activateCertificates($certificates)
    {
        foreach ($certificates as $certificate){
            $this->activateCertificate($certificate);
        }
        $this->em->flush();
    }

    /**
     * @param $data array
     */
    public function groupProcessCertificates($data)
    {
        /** @var $action SertAction */
        $action = $data["action"];
        if ($action == null){
            return;
        }

        /** @var $certificates Sertificate[] */
        $certificates = $data["certificates"];
        if (count($certificates) <= 0){
            return;
        }

        switch($action->getActionName()){
            case "activate":
                $this->activateCertificates($certificates);
                break;
        }
    }

    /**
     * @param $user User
     * @return array
     */
    public function getCertificatesWithActions($user)
    {
        $query_sql = "SELECT
            sertificate.ID_Sertificate,
            CONCAT_WS(\" \", sertificate.name, sertificate.last_name) AS `client_name`,
            sertificate.phone_number,
            flight_type.name AS `flight_type`,
            flight_type.price AS `flight_price`,
            flight_type.description_link AS `flight_link`,
            sertificate_state.ID_SertState,
            sertificate_state.name AS `state`
        FROM
            sertificate
        LEFT OUTER JOIN
            flight_type
        ON
            flight_type.ID_FlightType = sertificate.ID_FlightType
        LEFT OUTER JOIN
            sertificate_state
        ON
            sertificate_state.ID_SertState = sertificate.ID_SertState
        WHERE
            (sertificate.ID_User = :user_id) AND
            (sertificate.ID_SertState NOT IN (1))";

        $query = $this->em->getConnection()->prepare($query_sql);
        $query->execute(array(
            "user_id" => $user->getIDUser()
        ));
        /** @var $certificates array */
        $certificates = $query->fetchAll();

        /** @var $action_list SertAction[] */
        $action_list = $user->getIDUserGroup()->getAllowedActions()->toArray();

        /**
         * $action_groups - массив массивов действий. Первый индекс - номер состояния сертификата
         * Каждый элемент этого массива представляет собой массив доступных действий над сертификатом
         * в указанном состоянии
         *
         * @var $action_groups array
         */
        $action_groups = array();

        foreach ($certificates as $key => $certificate){
            $state_id = $certificate["ID_SertState"];
            if (!isset($action_groups[$state_id])) {
                $action_groups[$state_id] = array();
                foreach ($action_list as $action){
                    //Сформировать массив ID состояний
                    $allowed_ids = $action->getStates()->map(function($state){
                        /** @var $state SertState */
                        return $state->getIDSertState();
                    });

                    if (in_array($state_id, $allowed_ids->toArray())){
                        array_push($action_groups[$state_id], $action);
                    }
                }
            }
            $certificates[$key]["actions"] = $action_groups[$state_id];
        }

        return $certificates;
    }
}