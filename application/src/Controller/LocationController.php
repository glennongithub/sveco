<?PHP
namespace App\Controller;

use App\Entity\Location;
use App\Form\LocationType;
use App\Services\CORSService;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Translation\Translator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;



class LocationController extends Controller
{
    /**
     * @Route("{_locale}/admin/locations", name="admin/locations")
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @return Response
     */
    public function locationsAction(Request $request)
    {
        $session = $request->getSession();
        $em = $this->getDoctrine()->getManager();
        $location = new Location();
        $form = $this->createForm(LocationType::class, $location);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // $form->getData() holds the submitted values
            // but, the original `$area` variable has also been updated
            $location = $form->getData();

            // save it!
            $em->persist($location);
            $em->flush();
            // add flashbag if we get somewhere else so we can inform user in any case
            $session->getFlashBag()->add('notice', 'Location added');
            //return $this->redirectToRoute('task_success');
        }

        $locations = $em->getRepository(Location::class)->findAll();

        $user = $this->getUser();

        return $this->render('admin/locations.html.twig', array(
            'form' => $form->createView(),
            'locations' => $locations,
            'user' => $user,
        ));

    }

    /**
     * @Route("api/locations", name="api/locations")
     * @Method("GET")
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param CORSService $CORSService
     * @return Response
     */
    public function locationsApiAction(Request $request, CORSService $CORSService)
    {
        // we need to be able to convert obects from repositories to serialzed objects .. to ba able to create json of them
        $encoders = [ new JsonEncoder()];
        $normalizer = new ObjectNormalizer();
        //Fix circular exception error throwing

        $normalizer->setCircularReferenceHandler(function ($object) {
            return $object->getVisits();
        });

        //$normalizer->setCircularReferenceLimit(1);
        $serializer = new Serializer(array($normalizer), $encoders);

        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        $em = $this->getDoctrine()->getManager();
        $locations = $em->getRepository(Location::class)->findAll();

        $serializedLocations = $serializer->serialize($locations, 'json');

        $response = JsonResponse::fromJsonString($serializedLocations);
        //$response = new JsonResponse($serializedLocations);
        return $CORSService->getResponseCORS($request, $response);
    }
}