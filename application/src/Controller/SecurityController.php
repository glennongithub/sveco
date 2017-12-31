<?php
namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManager;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use App\Entity\User;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\JsonResponse;
use App\Services\CORSService;

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
        $user = new User('glenn');
        $plainPassword = 'password';
        $encoded = $encoder->encodePassword($user, $plainPassword);

        //$user->setUsername('glenn'); //done in constructor
        $user->setEmail('glenn@edgeweb.se');
        $user->setFullname('glenn vinbladh');
        $user->setPassword($encoded);

        $em->persist($user);
        $em->flush();

        return new Response("user created!");
    }

    /**
     * @Route("{_locale}/admin/createapikey")
     * @Template("admin/apikeycreated.html.twig")
     * @Security("has_role('ROLE_USER')")
     *
     * @param Request $request
     * @return array
     */
    public function createApiKeyAction(Request $request)
    {
        /** @var \Doctrine\ORM\EntityManager $em */
        $em = $this->get('doctrine')->getManager();

        $user = $this->getUser();

        // if no key set - set new
        if (!$user->getApiKey()) {
            $user->regenerateApiKey();
            $em->persist($user);
            $em->flush();
        }

        return [
            'apiKey' => $user->getApiKey(),
        ];
    }

    /**
     * @Route("/api/whoami")
     * @param Request $request
     * @param CORSService $CORSService
     * @Security("has_role('ROLE_USER')")
     * Template("debug.html.twig")
     * @return Response
     */
    public function apiWhoamiAction(Request $request, CORSService $CORSService)
    {
        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        /** @var User $user */
        $user = $this->getUser();

        $response = new JsonResponse([
            'username'  => $user->getUsername(),
            'key'   => $user->getApiKey(),
        ]);

        return $CORSService->getResponseCORS($request, $response);
        //return $this->get('sirvoy_cors')->getResponseCORS($request, $response);

    }

    /**
     * @Route("/account/generate-api-token")
     * @param Request $request
     * @param UserPasswordEncoderInterface $encoder
     * @param CORSService $CORSService
     * @return Response
     */
    public function generateApiToken(Request $request, UserPasswordEncoderInterface $encoder, CORSService $CORSService)
    {
        $username = $request->get('username');
        $password = $request->get('password');

        /** @var \Doctrine\ORM\EntityManager $em */
        $em = $this->get('doctrine')->getManager();

        if (!$username || !$password) {
            $response = new JsonResponse(['error' => 'Username and/or password cannot be empty!', 422]);
            return $CORSService->getResponseCORS($request, $response);
            //return $this->get('sirvoy_cors')->getResponseCORS($request, $response);
        }

        // search for user
        /** @var User $userEntity */
        $userEntity = $em->getRepository(User::class)->loadUserByUsername($username);
        if(!$userEntity) {
            // the response here should be the same as the below when no user is found to avoid give away if a user exists or not
            $response = new JsonResponse(['error' => 'Authentication failed', 400]);
            return $CORSService->getResponseCORS($request, $response);
            //return $this->get('sirvoy_cors')->getResponseCORS($request, $response);
        }

        //now test if password match
        if(!$encoder->isPasswordValid($userEntity,$password)) {
            // the response here should be the same as the above when no user is found to avoid give away if a user exists or not
            $response = new JsonResponse(['error' => 'Authentication failed!', 400]);
            return $CORSService->getResponseCORS($request, $response);
            //return $this->get('sirvoy_cors')->getResponseCORS($request, $response);
        }

        //Success.. return the apiKey
        $response = new JsonResponse([
            'key' => $userEntity->getApiKey(),
            'username' => $userEntity->getUsername()
        ]);

        return $CORSService->getResponseCORS($request, $response);

    }
}