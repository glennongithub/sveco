<?PHP
namespace App\Controller;

use App\Entity\Location;
use App\Form\LocationType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Translation\Translator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

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
}