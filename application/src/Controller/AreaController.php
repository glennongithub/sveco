<?PHP
namespace App\Controller;

use App\Entity\Area;
use App\Form\AreaType;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Translation\Translator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

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
}