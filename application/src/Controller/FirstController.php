<?PHP
namespace App\Controller;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\Translation\Translator;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Security;

class FirstController extends Controller
{
    /**
     * This and next is just a template methods with route to test verify we got everything working.
     * routing translations and security roles
     * Please build actual app in other controllers.
     *
     * The most interesting thing here is that we have one route without language specified. mostly to show that it is
     * possible if we want a search-engine for example to find a url without lang. But in reality we would always use
     * the lang url.  And the nice thing is that when building links in twig-files .. we get the correct _locale
     * included automagically by using this structure.
     *
     *
     * @Route("address/list", name="address_list_no_lang")
     * @Route("{_locale}/address/list", name="address_list",
     *     requirements={
     *          "_locale": "%app.locales%"}
     *     )
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @return Response
     */
    public function number(Request $request)
    {
        $number = mt_rand(0, 100);
        //$translator = new Translator('en');
        //$translated = $translator->trans('Testing');
        return $this->render('address/list.html.twig', array(
            'number' => $number,
            //'text' => $translated
        ));

    }

    /**
     * @Route("{_locale}/test", name="test")
     * @Security("has_role('ROLE_USER')")
     * @param Request $request
     * @return Response
     */
    public function test(Request $request)
    {
        return $this->render('test.html.twig', array(

        ));

    }
}