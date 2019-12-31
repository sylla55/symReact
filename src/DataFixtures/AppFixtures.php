<?php

namespace App\DataFixtures;

use App\Entity\Customer;
use App\Entity\Invoice;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\Persistence\ObjectManager;
use Faker\Factory;
use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;


class AppFixtures extends Fixture
{
    /**
     * L'encoder de mot de passe
     * @var UserPasswordEncoderInterface
     */
    private $encoder;

    public function __construct(UserPasswordEncoderInterface $encoder)
    {
        $this->encoder = $encoder;
    }

    public function load(ObjectManager $manager)
    {
        $fake = Factory::create("fr_FR");
        

        for($u = 0; $u < 10; $u++){
            $user = new User();
            $chrono = 1;
            $hash = $this->encoder->encodePassword($user,"demo");

            $user -> setFirstName($fake->firstName())
                  -> setLastName($fake->lastName)
                  -> setEmail($fake->email)
                  -> setPassword($hash);
            
            $manager->persist($user);

            for($i=0; $i < mt_rand(5,20); $i++){
                $cutomer = new Customer();
                $cutomer->setFirstName($fake->firstName())
                        ->setLastName($fake->lastName)
                        ->setCompany($fake->company)
                        ->setUser($user)
                        ->setEmail($fake->email);
                $manager->persist($cutomer);
    
                for($j=0; $j < mt_rand(3,10); $j++){
                    $invoice = new Invoice();
                    $invoice->setAmount($fake->randomFloat(2,250,5000))
                            ->setSentAt($fake->dateTimeBetween('-6 months'))
                            ->setStatus($fake->randomElement(['SENT','PAID','CANCELLED']))
                            ->setChrono($chrono)
                            ->setCustomer($cutomer);
    
                    $chrono++;
                    $manager->persist($invoice);
                }
            }
        }
        
        $manager->flush();
    }
}
