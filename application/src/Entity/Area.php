<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity
 * @UniqueEntity("area_name")
 */
class Area
{
    /**
     * @ORM\Id
     * @ORM\GeneratedValue
     * @ORM\Column(type="integer")
     */
    private $id;


    /**
     * This extra field is probaly never needed .. just added to test some stuff.
     * Only usefull if we on an area would like to easily find all locations using it.
     * And then we mostlikely could just build a specific query for that.
     * @var Location[]
     *
     * @ORM\OneToMany(targetEntity="Location", mappedBy="area")
     */
    private $locations;

    /**
     * @var string
     * @Assert\NotBlank()
     * @ORM\Column(type="string", length=100, nullable=false, unique=true)
     */
    protected $area_name;

    /**
     * Constructor
     */
    public function __construct()
    {

    }

    /**
     * @return mixed
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @return string
     */
    public function getAreaName()
    {
        return $this->area_name;
    }

    /**
     * @param string $area_name
     */
    public function setAreaName($area_name)
    {
        $this->area_name = $area_name;
    }

    /**
     * @return Location[]
     */
    public function getLocations()
    {
        return $this->locations;
    }

    /**
     * @param Location[] $locations
     */
    public function setLocations($locations)
    {
        $this->locations = $locations;
    }



}
