<?php

namespace App\Events;

use App\Entity\Customer;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;

class CustomerUserSuscriber implements EventSubscriberInterface{

    /**
     * @var Security $security
     */
    private $security;

    public function __construct(Security $security)
    {
        $this->security = $security;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW =>['setUserForCustomer',EventPriorities::PRE_VALIDATE]
        ];
    }

    /***
     * Cette methode permet de recuperer l'utilisateur 
     * actuel avant la creation du client
     * 
     * @param GetResponseForControllerResultEvent $event
     */
    public function setUserForCustomer(GetResponseForControllerResultEvent $event)
    {
        $resultat = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($resultat instanceof Customer && $method === "POST"){
            $user  = $this->security->getUser();
            $resultat->setUser($user);
        }
    }
}