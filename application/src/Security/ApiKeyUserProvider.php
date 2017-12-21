<?PHP
namespace App\Security;

use Doctrine\ORM\EntityManager;
use Symfony\Component\Security\Core\User\UserProviderInterface;
use App\Entity\User;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;

class ApiKeyUserProvider implements UserProviderInterface
{
    /**
     * @var EntityManager
     */
    private $em;

    public function __construct(EntityManager $em)
    {
        $this->em = $em;
    }
    public function getUsernameForApiKey($apiKey)
    {
        // Look up the username based on the token in the database

        // search for user
        /** @var User $user */
        $user = $this->em->getRepository(User::class)->findOneBy(array('apiKey' => $apiKey));
        // no user found
        if (!$user)
            throw new CustomUserMessageAuthenticationException(sprintf('ApiKey "%s" does not exist.', $apiKey));
        $username = $user->getUsername();

        return $username;
    }

    public function loadUserByUsername($username)
    {
        // We could do som extra roles and adminchecks here .. but for now ..
        // don't care about that . only make auth going for simple tasks .. no admin-task or switch use and stuff
        // if we want later .. look at EntityUserProvider for examples
        // As a understand it .. we must make sure the username exist here .. and return values we want.
        // so we ar kind of responsible to load from DB here .. since it not possible/good to do such a search in the
        // constructor on an entity

        //should be same as loadUserByUsername in UserRepository
        return $this->em->getRepository(User::class)->createQueryBuilder('u')
            ->where('u.username = :username OR u.email = :email')
            ->setParameter('username', $username)
            ->setParameter('email', $username)
            ->getQuery()
            ->getOneOrNullResult();

    }

    public function refreshUser(UserInterface $user)
    {
        // this is used for storing authentication in the session
        // but in this example, the token is sent in each request,
        // so authentication can be stateless. Throwing this exception
        // is proper to make things stateless
        throw new UnsupportedUserException();
    }

    public function supportsClass($class)
    {
        return User::class === $class;
    }
}
