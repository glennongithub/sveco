<?PHP
namespace App\Controller;

use App\Entity\Location;
use App\Entity\User;
use App\Entity\Visit;
use App\Services\CORSService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Method;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Translation\Translator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use App\Form\VisitType;
use Symfony\Component\Validator\Constraints\DateTime;

class VisitController extends Controller
{
    /**
     * This is more like a dummy route/method .. since we will probably never have a page listing all visits
     * @Route("{_locale}/admin/visits", name="admin/visits")
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @return Response
     */
    public function visitsAction(Request $request)
    {
        $session = $request->getSession();
        $em = $this->getDoctrine()->getManager();
        /** @var User $user */
        $user = $this->getUser();
        $visit = new Visit($user);
        $form = $this->createForm(VisitType::class, $visit);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // $form->getData() holds the submitted values
            // but, the original `$area` variable has also been updated
            $visit = $form->getData();

            // save it!
            $em->persist($visit);
            $em->flush();
            // add flashbag if we get somewhere else so we can inform user in any case
            $session->getFlashBag()->add('notice', 'Visit added');

            //return $this->redirectToRoute('task_success');
        }

        $visits = $em->getRepository(Visit::class)->findAll();

        return $this->render('admin/visits.html.twig', array(
            'form' => $form->createView(),
            'visits' => $visits,
        ));
    }

    /**
     * @Route("api/visit/{id}", name="api/visit", methods={"GET","HEAD"})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param CORSService $CORSService
     * @param int $id
     * @return Response
     */
    public function visitApiAction(Request $request, CORSService $CORSService, $id)
    {
        // we need to be able to convert objects from repositories to serialized objects .. to ba able to create json of them
        $encoders = [ new JsonEncoder()];
        $normalizer = new ObjectNormalizer();
        //Fix circular exception error throwing

        $normalizer->setCircularReferenceHandler(function ($object) {
            return $object->getLocation();
        });

        //$normalizer->setCircularReferenceLimit(1);
        $serializer = new Serializer(array($normalizer), $encoders);

        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $em = $this->getDoctrine()->getManager();

        /** @var Visit $locationEntity */
        $visitEntity = $em->getRepository(Visit::class)->find($id);

        $serializedVisit = $serializer->serialize($visitEntity, 'json');

        $response = JsonResponse::fromJsonString($serializedVisit);

        return $CORSService->getResponseCORS($request, $response);
    }

    /**
     * @Route("api/visit", name="api/add_visit", methods="POST")
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param CORSService $CORSService
     * @return Response
     */
    public function addVisitApiAction(Request $request, CORSService $CORSService)
    {
        // we need to be able to convert objects from repositories to serialized objects .. to ba able to create json of them
        $encoders = [ new JsonEncoder()];
        $normalizer = new ObjectNormalizer();
        //Fix circular exception error throwing
        $normalizer->setCircularReferenceHandler(function ($object) {
            return null;
        });

        $serializer = new Serializer(array($normalizer), $encoders);

        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $em = $this->getDoctrine()->getManager();
        $body = $request->getContent();
        $visit = json_decode($body, true);

        /** @var Location $location */
        $location = $em->getRepository(Location::class)->find($visit['locationId']);

        /** @var User $user */
        $user = $this->getUser();

        /** @var Visit $locationEntity */
        $visitEntity = new Visit($user, $location); //Setting it on creation ..


        // just set all fields manually for now .. maybe use formType later


        $visitEntity->setNote($visit['note']);
        $visitEntity->setStatus($visit['status']);

        // visitDate may be overriden by what user set.. but also if nothing is set .. it is set to now in the contructor
        if($visit['visitDate'])
        {
            //$visitDate = \DateTime::createFromFormat('Y-m-d H:i:s', $visit['visitDate']);
            $visitDate = \DateTime::createFromFormat('Y-m-d\TH:i:s+', $visit['visitDate']);
            $visitEntity->setVisitDate($visitDate );
        }

        //persist
        $em->persist($visitEntity);
        $em->flush();

        //kill ref to location .. since we do not want that in this response.

        //return the added visit
        $serializedVisit = $serializer->serialize($visitEntity, 'json');

        $response = JsonResponse::fromJsonString($serializedVisit);

        return $CORSService->getResponseCORS($request, $response);
    }



    /**
     * https://stackoverflow.com/questions/12111936/angularjs-performs-an-options-http-request-for-a-cross-origin-resource
     *
     * Adding method options to allow for the test done when CORS is used
     * @Route("api/visit/{id}", name="api/delete_visit", methods={"DELETE", "OPTIONS"})
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param CORSService $CORSService
     * @param int $id
     * @return Response
     */
    public function deleteVisitApiAction(Request $request, CORSService $CORSService, $id)
    {
        // Maybe bad solution but testing for now
        if($request->getMethod() == 'OPTIONS')
        {
            // just return anything for now. this is a testrun request
            return $CORSService->getResponseCORS($request, new JsonResponse(['OK']));
        }

        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');

        $em = $this->getDoctrine()->getManager();

        /** @var Visit $locationEntity */
        $visitEntity = $em->getRepository(Visit::class)->find($id);

        $em->remove($visitEntity);
        $em->flush();

        //TODO add som form of error handling here and return errors and so
        $result = ['result' => 'OK'];

        $response = new JsonResponse($result);

        return $CORSService->getResponseCORS($request, $response);
    }
}