<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class LuckyController extends AbstractController
{
  #[Route('/lucky/number/', methods: ['GET'])]
  public function number1(): Response
  {
    $number = random_int(0, 100);

    return $this->render('lucky/number.html.twig', [
        'number' => $number,
    ]);
  }

  #[Route('/lucky/number/{number}', methods: ['GET'])]
  public function number2(int $number = 0): Response
  {
    return $this->render('lucky/number.html.twig', [
        'number' => $number,
    ]);
  }
}