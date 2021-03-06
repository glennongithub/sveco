<?PHP
namespace App\Controller;

use App\Entity\Area;
use App\Form\AreaType;
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

class AreaController extends Controller
{
    /**
     * @Route("{_locale}/admin/areas", name="admin/areas")
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @return Response
     */
    public function areasAction(Request $request)
    {
        //$session = new Session();
        //$session->start();
        $session = $request->getSession();
        $em = $this->getDoctrine()->getManager();
        $area = new Area();
        $form = $this->createForm(AreaType::class, $area);

        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // $form->getData() holds the submitted values
            // but, the original `$area` variable has also been updated
            $area = $form->getData();

            // save it!
            $em->persist($area);
            $em->flush();
            // add flashbag if we get somewhere else so we can inform user in any case
            $session->getFlashBag()->add('notice', 'Area added');
            //return $this->redirectToRoute('task_success');
        }

        $areas = $em->getRepository(Area::class)->findAll();

        return $this->render('admin/areas.html.twig', array(
            'form' => $form->createView(),
            'areas' => $areas,
        ));

    }

    /**
     * @Route("api/areas/{searchString}", name="api/areas/searchstring", defaults={"searchString" = ""})
     * @Route("api/areas", name="api/areas")
     * @Method("GET")
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @param CORSService $CORSService
     * @param string $searchString
     * @return Response
     */
    public function areasApiAction(Request $request, CORSService $CORSService, string $searchString)
    {
        // we need to be able to convert objects from repositories to serialized objects .. to ba able to create json of them
        $encoders = [ new JsonEncoder()];
        $normalizer = new ObjectNormalizer();
        /*
        //Fix circular exception error throwing
        $normalizer->setCircularReferenceHandler(function ($object) {
            return $object->getVisits();
        });
        */

        //$normalizer->setCircularReferenceLimit(1);
        $serializer = new Serializer(array($normalizer), $encoders);

        $this->denyAccessUnlessGranted('IS_AUTHENTICATED_FULLY');
        $em = $this->getDoctrine()->getManager();
        $areas = $em->getRepository(Area::class)->findAll();

        $serializedAreas = $serializer->serialize($areas, 'json');

        $response = JsonResponse::fromJsonString($serializedAreas);
        //$response = new JsonResponse($serializedAreas);
        return $CORSService->getResponseCORS($request, $response);
    }
}