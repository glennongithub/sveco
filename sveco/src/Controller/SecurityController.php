<?php
namespace App\Controller;

use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
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
     * @Route("/login2", name="login2")
     */
    public function login2(Request $request, AuthenticationUtils $authUtils)
    {
        // get the login error if there is one
        $error = $authUtils->getLastAuthenticationError();

        return $this->render('security/login.html.twig', array(
            'last_username' => 'tho',
            'error'         => $error,
        ));
    }

    /**
     * @Route("/logout", name="logout")
     */
    public function logout(Request $request, AuthenticationUtils $authUtils)
    {
        echo "logging out!";
    }

    /**
     * @Route("/logout/success", name="logout_success")
     */
    public function logout_success(Request $request, AuthenticationUtils $authUtils)
    {
        echo "loged out!";
    }



    /**
     * @Route("/failed_login", name="failed_login")
     */
    public function failed_login(Request $request, AuthenticationUtils $authUtils)
    {
        echo "Failed!";
    }


    /**
     * @param UserPasswordEncoderInterface $encoder
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
    }

}