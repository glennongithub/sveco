<?PHP
namespace App\Controller;

use App\Entity\Area;
use App\Entity\Location;
use App\Form\LocationType;
use App\Services\CORSService;
use function MongoDB\BSON\toJSON;
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
        // we need to be able to convert objects from repositories to serialized objects .. to ba able to create json of them
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

    /**
     * Would like to have this as a PUT request .. but I cannot get it to work .. and since troubleshooting is very hard
     * when running via api i leave it for now
     *
     * @Route("api/location/{id}", name="api/update_location")
     * @Method("POST")
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param CORSService $CORSService
     * @param int $id
     * @return Response
     */
    public function updateLocationApiAction(Request $request, CORSService $CORSService, $id)
    {
        // we need to be able to convert objects from repositories to serialized objects .. to ba able to create json of them
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
        $body = $request->getContent();
        $location = json_decode($body, true);


        /** @var Location $locationEntity */
        $locationEntity = $em->getRepository(Location::class)->find($id);

        /** @var Area $area */
        $area = $em->getRepository(Area::class)->find($location['area']['id']);

        // just set all fields manually for now .. maybe use formType later
        $locationEntity->setAddress($location['address']);
        $locationEntity->setLanguage($location['language']);
        $locationEntity->setType($location['type']);
        $locationEntity->setArea($area);
        $locationEntity->setApartmentNr($location['apartmentNr']);
        $locationEntity->setNote($location['note']);
        $locationEntity->setIsBusiness($location['isBusiness']);

        //persist
        $em->persist($locationEntity);
        $em->flush();

        //refetch and return
        $updatedLocation = $em->getRepository(Location::class)->find($location['id']);

        $serializedLocation = $serializer->serialize($updatedLocation, 'json');

        $response = JsonResponse::fromJsonString($serializedLocation);

        return $CORSService->getResponseCORS($request, $response);
    }
}