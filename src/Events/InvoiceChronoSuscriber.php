<?php

namespace App\Events;

use App\Entity\Invoice;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Repository\InvoiceRepository;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;

class InvoiceChronoSuscriber implements EventSubscriberInterface{

    private $security;
    private $repository;

    public function __construct(Security $security, InvoiceRepository $repository)
    {
        $this->security = $security;
        $this->repository = $repository;
    }
    
    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setChronoForInvoice',EventPriorities::PRE_VALIDATE]
        ];
    }

    /**
     * Cette methode permet d'increnter le chrono
     * @param GetResponseForControllerResultEvent $event
     */
    public function setChronoForInvoice(GetResponseForControllerResultEvent $event)
    {
        $result = $event->getControllerResult();
        $user = $this->security->getUser();
        $method = $event->getRequest()->getMethod();
       
        if($result instanceof Invoice && $method === "POST"){
            $chrono = $this->repository->findNextChrono($user);
            $result->setChrono($chrono);
        }
    }
}