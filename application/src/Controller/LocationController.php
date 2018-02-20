<?PHP
namespace App\Controller;

use App\Entity\Area;
use App\Entity\Location;
use App\Entity\User;
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
        /** @var User $user */
        $user = $this->getUser();
        $location = new Location($user);
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

        //TODO here we need to implement possibillity to filter search.
        // decide what we can filter on and what parameters that shall have.
        // will probably be an advanced DQL query to make all possible seaches possible.
        $locations = $em->getRepository(Location::class)->findAll();

        $serializedLocations = $serializer->serialize($locations, 'json');

        $response = JsonResponse::fromJsonString($serializedLocations);
        //$response = new JsonResponse($serializedLocations);
        return $CORSService->getResponseCORS($request, $response);
    }

    /**
     * @Route("api/location", name="api/add_location")
     * @Method("POST")
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param CORSService $CORSService
     * @return Response
     */
    public function addLocationApiAction(Request $request, CORSService $CORSService)
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


        /** @var User $user */
        $user = $this->getUser();

        /** @var Location $locationEntity */
        $locationEntity = new Location($user); //Setting it on creation .. only updating if Myreturnvisit set

        //we cannot be sure an area is selected
        //TODO make sure update works solid to .. not sure right now if one can crash it by updating and setting bad data in area
        if(isset($location['area']) && isset($location['area']['id']))
        {
            /** @var Area $area */
            $area = $em->getRepository(Area::class)->find($location['area']['id']);
            //only set it if we find one
            if($area)
                $locationEntity->setArea($area);
        }

        // just set all fields manually for now .. maybe use formType later
        $locationEntity->setAddress($location['address']); //dummydata;
        $locationEntity->setFormattedAddressString(($location['formattedAddressString']));
        $locationEntity->setLanguage($location['language']);
        $locationEntity->setType($location['type']);

        $locationEntity->setApartmentNr($location['apartmentNr']);
        $locationEntity->setNote($location['note']);
        $locationEntity->setIsBusiness($location['isBusiness']);
        $locationEntity->setIsReturnVisit($location['isReturnVisit']);

        //persist
        $em->persist($locationEntity);
        $em->flush();

        //return the added location
        $serializedLocation = $serializer->serialize($locationEntity, 'json');

        $response = JsonResponse::fromJsonString($serializedLocation);

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
        $locationEntity->setFormattedAddressString($location['formattedAddressString']);
        $locationEntity->setAddress($location['address']);
        $locationEntity->setLanguage($location['language']);
        $locationEntity->setType($location['type']);
        $locationEntity->setArea($area);
        $locationEntity->setApartmentNr($location['apartmentNr']);
        $locationEntity->setNote($location['note']);
        $locationEntity->setIsBusiness($location['isBusiness']);

        //If isReturnVisit or user changed has changed .. we also update user
        if($location['isReturnVisit'] != $locationEntity->getIsReturnVisit() || $location['user']['username'] != $locationEntity->getUser()->getUsername()){
            /** @var User $user */
            $user = $this->getUser();
            $locationEntity->setUser($user);
            $locationEntity->setIsReturnVisit($location['isReturnVisit']);
        }

        //persist
        $em->persist($locationEntity);
        $em->flush();

        //refetch and return
        $updatedLocation = $em->getRepository(Location::class)->find($location['id']);

        $serializedLocation = $serializer->serialize($updatedLocation, 'json');

        $response = JsonResponse::fromJsonString($serializedLocation);

        return $CORSService->getResponseCORS($request, $response);
    }

    /**
     * https://stackoverflow.com/questions/12111936/angularjs-performs-an-options-http-request-for-a-cross-origin-resource
     *
     * Adding method options to allow for the test done when CORS is used
     * @Route("api/location/{id}", name="api/delete_location", methods={"DELETE", "OPTIONS"})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param CORSService $CORSService
     * @param int $id
     * @return Response
     */
    public function deleteLocationApiAction(Request $request, CORSService $CORSService, $id)
    {
        // Maybe bad solution but testing for now
        if($request->getMethod() == 'OPTIONS')
        {
            // just return anything for now. this is a testrun request
            return $CORSService->getResponseCORS($request, new JsonResponse(['OK']));
        }

        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $em = $this->getDoctrine()->getManager();

        /** @var Location $locationEntity */
        $LocationEntity = $em->getRepository(Location::class)->find($id);

        $em->remove($LocationEntity);
        $em->flush();

        //TODO add som form of error handling here and return errors and so
        $result = ['result' => 'OK'];

        $response = new JsonResponse($result);

        return $CORSService->getResponseCORS($request, $response);
    }
}