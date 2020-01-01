<?php

namespace App\Events;

use App\Entity\User;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class PasswordEncoderSubscriber implements EventSubscriberInterface {

    /**
     * @var UserPasswordEncoderInterface $encoder
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['encodePasword',EventPriorities::PRE_WRITE]
        ];
    }

    /**
     *  Cette methode permet d'encoder le password avant qu'il soit enregistrer dans la BDD
     * @param GetResponseForControllerResultEvent $envent
     */
    public function encodePasword(GetResponseForControllerResultEvent $event)
    {
       $result = $event->getControllerResult();
       $method = $event->getRequest()->getMethod();

       if($result instanceof User && $method === "POST"){
           $hash = $this->encoder->encodePassword($result,$result->getPassword());
           $result->setPassword($hash);
       }
    }
}