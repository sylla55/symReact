<?php

namespace App\Events;

use Symfony\Component\HttpKernel\KernelEvents;
use ApiPlatform\Core\EventListener\EventPriorities;
use App\Entity\Invoice;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\Serializer\Normalizer\GetSetMethodNormalizer;
use Symfony\Component\HttpKernel\Event\GetResponseForControllerResultEvent;

class InvoicesSentAtSuscriber implements EventSubscriberInterface{

    public static function getSubscribedEvents()
    {
        return [
            KernelEvents::VIEW => ['setSentAtForInvoice',EventPriorities::PRE_VALIDATE]
        ];
    }

    /**
     * Cette methode permet donner la date du jour à la facture
     * 
     * @param GetResponseForControllerResultEvent $event
     */
    public function setSentAtForInvoice(GetResponseForControllerResultEvent $event){
        $result = $event->getControllerResult();
        $method = $event->getRequest()->getMethod();

        if($result instanceof Invoice && $method === "POST"){
            if(empty($result->getSentAt())){
                $result->setSentAt(new \DateTime());
            }
        }
    }
}