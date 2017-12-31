<?PHP
namespace App\Controller;

use App\Entity\User;
use App\Entity\Visit;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Session\Session;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Translation\Translator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;
use App\Form\VisitType;

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
}