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
     * @var User
     *
     * @ORM\ManyToOne(targetEntity="User")
     * @ORM\JoinColumn(name="user_id", referencedColumnName="id", onDelete="CASCADE")
     */
    protected $user;

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
     * @ORM\Column(type="json_array", nullable=false)
     */
    protected $address;

    /**
     * This location is only set if we in future decide to allow to specify a pin-location that is diferent from the
     * one sugested by google-api.  and will contain som parts of a pin or a full pin .. who knows :)
     * @var string
     *
     * @ORM\Column(type="json_array", nullable=true)
     */
    protected $overRideLocation;

    /**
     * @var string
     *
     * @ORM\Column(type="text", nullable=false)
     */
    protected $formattedAddressString;

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
     * @ORM\Column(type="text", nullable=false, options={"default":"APARTMENT"})
     * @Assert\Choice(multiple = false, min = 1,
     *   choices = {
     *     "APARTMENT",
     *     "HOUSE",
     *   },
     *   message = "assert_choice.msg",
     *   minMessage = "min_msg",
     *   multipleMessage = "invalid_choices",
     * )
     */
    protected $type;

    /**
     * @var boolean
     *
     * @ORM\Column(type="boolean")

     */
    protected $isBusiness;

    /**
     * @var boolean
     *
     * @ORM\Column(type="boolean")

     */
    protected $isReturnVisit;

    /**
     * @var string
     *
     * @ORM\Column(type="string", length=50, nullable=true)
     */
    protected $apartment_nr;


    /**
     * Location constructor.
     * @param array $address
     * @param User $user
     */
    public function __construct(User $user)
    {
        $this->updatedTimestamps();
        $this->address = [];
        $this->user = $user;
        $this->visits = new ArrayCollection();

        $this->overRideLocation = []; //always set it to empty


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
     * @return array
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

    /**
     * @return bool
     */
    public function getIsBusiness()
    {
        return $this->isBusiness;
    }

    /**
     * @param bool $isBusiness
     */
    public function setIsBusiness($isBusiness)
    {
        $this->isBusiness = $isBusiness;
    }

    /**
     * Helper function to get status from latest visit since that represents status of this location
     * if no visits registered .. we use status unknown
     * @return array|string
     */
    public function getStatus()
    {
        $visits = $this->getVisits();

        // if no visits registered we know it's unknown
        if(count($visits) < 1)
            return 'UNKNOWN';

        //set latest visit to the first in array
        $latestKnownVisit = $visits[0];

        // if only one visits registered we know we are going to return this
        if(count($visits) == 1)
            return $latestKnownVisit->getStatus();

        //we actually have some visit. Find latest one
        foreach($visits as $visit)
        {
            //replace latestKnown with current if later
            if($visit->getVisitDate() > $latestKnownVisit->getVisitDate())
                $latestKnownVisit = $visit;

        }

        //return latest visit-status
        return $latestKnownVisit->getStatus();
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

    /**
     * @return string
     */
    public function getFormattedAddressString()
    {
        return $this->formattedAddressString;
    }

    /**
     * @param string $formattedAddressString
     */
    public function setFormattedAddressString($formattedAddressString)
    {
        $this->formattedAddressString = $formattedAddressString;
    }

    /**
     * @return bool
     */
    public function getIsReturnVisit()
    {
        return $this->isReturnVisit;
    }

    /**
     * @param bool $isReturnVisit
     */
    public function setIsReturnVisit($isReturnVisit)
    {
        $this->isReturnVisit = $isReturnVisit;
    }

    /**
     * @return array
     */
    public function getOverRideLocation()
    {
        return $this->overRideLocation;
    }

    /**
     * @param string $overRideLocation
     */
    public function setOverRideLocation($overRideLocation)
    {
        $this->overRideLocation = $overRideLocation;
    }

}
