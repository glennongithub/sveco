<?php
namespace App\Form;

use App\Entity\Area;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\OptionsResolver\OptionsResolver;

class AreaType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('areaName')
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
            'data_class' => Area::class,
        ));
    }
}