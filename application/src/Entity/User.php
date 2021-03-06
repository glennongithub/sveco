<?php
namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\AdvancedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Ramsey\Uuid\Uuid;


/**
* @ORM\Table(name="app_users")
* @ORM\Entity(repositoryClass="App\Repository\UserRepository")
*/
class User implements AdvancedUserInterface, \Serializable
{
    /**
    * @ORM\Column(type="integer")
    * @ORM\Id
    * @ORM\GeneratedValue(strategy="AUTO")
    */
    private $id;

    /**
     * @ORM\Column(type="string", length=255, unique=true)
     */
    private $fullname;

    /**
    * @ORM\Column(type="string", length=25, unique=true)
    */
    private $username;

    /**
    * @ORM\Column(type="string", length=64)
    */
    private $password;

    /**
    * @ORM\Column(type="string", length=60, unique=true)
    */
    private $email;

    /**
     * @ORM\Column(type="json_array")
     */
    private $roles = array();

    /**
    * @ORM\Column(name="is_active", type="boolean")
    */
    private $isActive;

    /**
     * @var string
     *
     * @ORM\Column(name="api_key", type="guid", nullable=true)
     */
    private $apiKey;

    public function __construct($username)
    {
        $this->username = $username;
        $this->isActive = true;
        // may not be needed, see section on salt below
        // $this->salt = md5(uniqid('', true));
    }


    public function getUsername()
    {
        return $this->username;
    }

    public function setUsername($username)
    {
        //TODO fix up annaotaions .. and some validation
        $this->username = $username;
        return $this;
    }

    public function setPassword($password)
    {
        //TODO fix up annaotaions .. and some validation
        $this->password = $password;
        return $this;
    }

    public function setEmail($email)
    {
        //TODO fix up annaotaions .. and some validation
        $this->email = $email;
        return $this;
    }

    /**
     * @return mixed
     */
    public function getEmail()
    {
        return $this->email;
    }

    public function setRoles(array $roles)
    {
        $this->roles = $roles;

        // allows for chaining
        return $this;
    }

    public function getSalt()
    {
    // you *may* need a real salt depending on your encoder
    // see section on salt below
    return null;
    }

    public function getPassword()
    {
    return $this->password;
    }

    public function getRoles()
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    public function eraseCredentials()
    {
    }

    public function isAccountNonExpired()
    {
        return true;
    }

    public function isAccountNonLocked()
    {
        return true;
    }

    public function isCredentialsNonExpired()
    {
        return true;
    }

    public function isEnabled()
    {
        return $this->isActive;
    }

    /**
     * @return mixed
     */
    public function getFullname()
    {
        return $this->fullname;
    }

    /**
     * @param mixed $fullname
     */
    public function setFullname($fullname)
    {
        $this->fullname = $fullname;
    }

    /**
     * Get apiKey
     *
     * @return string
     */
    public function getApiKey()
    {
        return $this->apiKey;
    }

    /**
     * Set accessKey
     *
     * @param string $apiKey
     * @return User
     */
    public function setApiKey($apiKey)
    {
        $this->apiKey = $apiKey;
        return $this;
    }

    /**
     * Regenerate apiKey
     *
     * @return User
     */
    public function regenerateApiKey()
    {
        $this->apiKey = Uuid::uuid4()->toString();
        return $this;
    }



    /** @see \Serializable::serialize() */
    public function serialize()
    {
        return serialize(array(
            $this->id,
            $this->username,
            $this->password,
            $this->isActive,
        // see section on salt below
        // $this->salt,
        ));
    }

    /** @see \Serializable::unserialize() */
    public function unserialize($serialized)
    {
        list (
            $this->id,
            $this->username,
            $this->password,
            $this->isActive
        // see section on salt below
        // $this->salt
        ) = unserialize($serialized);
    }
}