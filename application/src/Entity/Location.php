<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * @ORM\Entity
 */
class Location
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;


    /**
     * @ORM\Column(type="datetime")
     */
    protected $created_at;

    /**
     * @ORM\Column(type="datetime")
     */
    protected $modified_at;

    /**
     * @var Visit[]
     *
     * @ORM\OneToMany(targetEntity="Visit", mappedBy="location")
     */
    protected $visits;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    protected $language;

    /**
     * @var string
     *
     * @ORM\Column(type="text", nullable=false)
     */
    protected $address;

    /**
     * @var Area
     *
     * @ORM\ManyToOne(targetEntity="Area")
     * @ORM\JoinColumn(name="area_id", referencedColumnName="id", onDelete="CASCADE")
     */
    protected $area;

    /**
     * @var string
     *
     * @ORM\Column(type="text", nullable=true)
     */
    protected $note;

    /**
     * @var array
     *
     * @ORM\Column(type="text", nullable=false)
     * @Assert\Choice(multiple = false, min = 1,
     *   choices = {
     *     "PRIVATE_APARTMENT",
     *     "PRIVATE_HOUSE",
     *     "BUSINESS_APARTMENT",
     *     "BUSINESS_HOUSE"
     *   },
     *   message = "assert_choice.msg",
     *   minMessage = "min_msg",
     *   multipleMessage = "invalid_choices",
     * )
     */
    protected $type;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    protected $apartment_nr;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->updatedTimestamps();
       $this->visits = new ArrayCollection();

    }

    /**
     * Tell doctrine that before we persist or update we call the updatedTimestamps() function.
     *
     * @ORM\PrePersist
     * @ORM\PreUpdate
     */
    public function updatedTimestamps()
    {
        $dt_now = new \DateTime(date('Y-m-d H:i:s'));
        $this->setModifiedAt($dt_now);
        if($this->getCreatedAt() == null)
            $this->setCreatedAt($dt_now);
    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return mixed
     */
    public function getCreatedAt()
    {
        return $this->created_at;
    }

    /**
     * @param mixed $created_at
     */
    public function setCreatedAt($created_at)
    {
        $this->created_at = $created_at;
    }

    /**
     * @return mixed
     */
    public function getModifiedAt()
    {
        return $this->modified_at;
    }

    /**
     * @param mixed $modified_at
     */
    public function setModifiedAt($modified_at)
    {
        $this->modified_at = $modified_at;
    }

    /**
     * @return Visit[]
     */
    public function getVisits()
    {
        return $this->visits;
    }

    /**
     * @param Visit $visits
     */
    public function setVisits($visits)
    {
        $this->visits = $visits;
    }

    /**
     * @return string
     */
    public function getLanguage()
    {
        return $this->language;
    }

    /**
     * @param string $language
     */
    public function setLanguage($language)
    {
        $this->language = $language;
    }

    /**
     * @return string
     */
    public function getAddress()
    {
        return $this->address;
    }

    /**
     * @param string $address
     */
    public function setAddress($address)
    {
        $this->address = $address;
    }

    /**
     * @return Area
     */
    public function getArea()
    {
        return $this->area;
    }

    /**
     * @param Area $area
     */
    public function setArea($area)
    {
        $this->area = $area;
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
     * @return array
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @param array $type
     */
    public function setType($type)
    {
        $this->type = $type;
    }

    /**
     * @return string
     */
    public function getApartmentNr()
    {
        return $this->apartment_nr;
    }

    /**
     * @param string $apartment_nr
     */
    public function setApartmentNr($apartment_nr)
    {
        $this->apartment_nr = $apartment_nr;
    }

}
