<?php
namespace App\Form;

use App\Entity\Location;

use App\Entity\User;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\OptionsResolver\OptionsResolver;
use App\Entity\Visit;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;

class VisitType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options)
    {
        $builder
            ->add('location', EntityType::class, [
                // query choices from this entity
                'class' => Location::class,
                // use the location.address property as the visible option string
                'choice_label' => 'formattedAddressString',
                // used to render a select box, check boxes or radios
                // 'multiple' => true,
                // 'expanded' => true,
            ])
            ->add('user', EntityType::class, [
                // query choices from this entity
                'class' => User::class,
                // use the User.fullname property as the visible option string
                'choice_label' => 'fullname',
                //'attr' => ['' => 'disabled'], //nope .. this prevents it from be handled and saved properly
                // used to render a select box, check boxes or radios
                // 'multiple' => true,
                // 'expanded' => true,
            ])
            /* This is not really to be set in form .. but if allowed use the following for now
            ->add('visitDate', DateTimeType::class, [
                'placeholder' => 'Select a value',
            ])
            */
            ->add('status', ChoiceType::class, [
                    'choices' => [
                        'not_at_home' => 'NOT_AT_HOME',
                        'interested' => 'INTERESTED',
                        'not_interested' => 'NOT_INTERESTED',
                    ]
                ]
            )
            ->add('note', TextareaType::class, [
                'attr' => ['class' => 'tinymce'],
                'required'   => false
            ])
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
            'data_class' => Visit::class,
        ));
    }
}