<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 */
class Visit
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @var Location
     *
     * @ORM\ManyToOne(targetEntity="Location", inversedBy="visits")
     * @ORM\JoinColumn(name="location_id", referencedColumnName="id", onDelete="CASCADE")
     */
    protected $location;

    /**
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="CASCADE")
     */
    protected $user;


    /**
     * @ORM\Column(type="datetime")
     */
    protected $visit_date;

    /**
     * @var array
     *
     * @ORM\Column(type="text", nullable=false)
     * @Assert\Choice(multiple = false, min = 1,
     *   choices = {
     *     "NOT_AT_HOME",
     *     "NOT_INTERESTED",
     *     "INTERESTED",
     *   },
     *   message = "assert_choice.msg",
     *   minMessage = "min_msg",
     *   multipleMessage = "invalid_choices",
     * )
     */
    protected $status;


    /**
     * @var string
     *
     * @ORM\Column(type="text", nullable=true)
     */
    protected $note;


    /**
     * Constructor
     * @param User $user
     */
    public function __construct(User $user)
    {
        //always set default visitdate to now
        $dt_now = new \DateTime(date('Y-m-d H:i:s'));
        $this->visit_date = $dt_now;

        // All visits must belong to a user. so its kind of required
        $this->user = $user;

    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param mixed $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return Location
     */
    public function getLocation()
    {
        return $this->location;
    }

    /**
     * @param Location $location
     */
    public function setLocation($location)
    {
        $this->location = $location;
    }

    /**
     * @return mixed
     */
    public function getVisitDate()
    {
        return $this->visit_date;
    }

    /**
     * @param mixed $visit_date
     */
    public function setVisitDate($visit_date)
    {
        $this->visit_date = $visit_date;
    }

    /**
     * @return array
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * @param array $status
     */
    public function setStatus($status)
    {
        $this->status = $status;
    }

    /**
     * @return string
     */
    public function getNote()
    {
        return $this->note;
    }

    /**
     * @param string $note
     */
    public function setNote($note)
    {
        $this->note = $note;
    }

    /**
     * @return User
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param User $user
     */
    public function setUser($user)
    {
        $this->user = $user;
    }



}
