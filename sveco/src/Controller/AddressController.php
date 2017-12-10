<?PHP
namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Translation\Translator;

class AddressController extends Controller
{
    /**
    * @Route("/address/list")
     * @param Request $request
     * @return Response
    */
    public function number(Request $request)
    {
        $request->setLocale('sv');
        $number = mt_rand(0, 100);
        //$translator = new Translator('en');
        //$translated = $translator->trans('Testing');
        return $this->render('address/list.html.twig', array(
            'number' => $number,
            //'text' => $translated
        ));

    }
}