<?php
namespace App\Controller;

use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use App\Entity\User;

use Symfony\Component\Security\Core\Encoder\UserPasswordEncoderInterface;

class SecurityController extends Controller
{


    /**
     * @Route("/login", name="login")
     */
    public function login(Request $request, AuthenticationUtils $authUtils)
    {
        // get the login error if there is one
        $error = $authUtils->getLastAuthenticationError();

        // last username entered by the user
        $lastUsername = $authUtils->getLastUsername();

        return $this->render('security/login.html.twig', array(
            'last_username' => $lastUsername,
            'error'         => $error,
        ));
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logout(Request $request, AuthenticationUtils $authUtils)
    {

        // if we need to do something on logut do it here.
        // it will automagically be done by telling sexurity.yml to do it by this route:
        // but this route need to exist for it to work .. even if we do not do anything in thes controller really
        return new Response("loggin out!");
    }


    /**
     * @Route("/logout/success", name="logout_success")
     */
    public function logout_success(Request $request, AuthenticationUtils $authUtils)
    {
        //TODO create nicer view .. or redir to something meaningfull .. like login ..
        return new Response("loged out!");
    }



    /**
     * @Route("/failed_login", name="failed_login")
     */
    public function failed_login(Request $request, AuthenticationUtils $authUtils)
    {
        // get the login error if there is one
        $error = $authUtils->getLastAuthenticationError();
        return new Response("Failed! ". $error->getMessage());

        // When we rebuild this to use a real twig temple .. we just pass $error to template an echo out what we want from there
    }


    /**
     * @param UserPasswordEncoderInterface $encoder
     * @return Response
     * @Route("/createuser", name="create_user")
     */
    public function register(UserPasswordEncoderInterface $encoder)
    {

        /** @var EntityManager $em */
        $em = $this->get('doctrine')->getManager();
        // whatever *your* User object is
        $user = new User();
        $plainPassword = 'password';
        $encoded = $encoder->encodePassword($user, $plainPassword);

        $user->setUsername('glenn');
        $user->setEmail('glenn@edgeweb.se');
        $user->setPassword($encoded);

        $em->persist($user);
        $em->flush();

        return new Response("user created!");
    }

}