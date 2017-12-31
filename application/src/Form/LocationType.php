<?php
namespace App\Form;

use App\Entity\Area;
use App\Entity\Location;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class LocationType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('language', ChoiceType::class, [
                'choices' => [
                    'se' => 'SWEDISH',
                    'dk' => 'DANISH',
                    'no' => 'NORWEGIAN',
                    'nan' => 'NOT_KNOWN',
                ]
            ])
            ->add('address')
            ->add('area', EntityType::class, [
                // query choices from this entity
                'class' => Area::class,
                // use the Area.areaName property as the visible option string
                'choice_label' => 'areaName',
                // used to render a select box, check boxes or radios
                // 'multiple' => true,
                // 'expanded' => true,
            ])
            ->add('note', TextareaType::class, [
                'attr' => ['class' => 'tinymce'],
                'required'   => false
            ])
            ->add('type', ChoiceType::class, [
                'choices' => [
                    'apartment' => 'APARTMENT',
                    'house' => 'HOUSE',
                ]
            ])
            ->add('isBusiness' )
            ->add('save', SubmitType::class)
        ;
    }

    /**
     * This method needs to be set on all formTypes that may be included in other forms .. since then the guess from
     * createForm is not sufficient ..since the parent entity is passed
     * @param OptionsResolver $resolver
     */
    public function configureOptions(OptionsResolver $resolver)
    {
        $resolver->setDefaults(array(
            'data_class' => Location::class,
        ));
    }
}