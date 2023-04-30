<?php

declare(strict_types=1);

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

use App\Entity\LibraryModel;

class LibraryController extends AbstractController
{
  #[Route('/', methods: ['GET', 'POST'])]
  public function index(Connection $connection): Response
  {
    $model = new LibraryModel();
    $result = $model->GetLinks($connection);

    return $this->render('library.html.twig', [
      'links' => $result[0],
      'genres' => $result[1],
      'authors' => $result[2],
    ]);
  }

  #[Route('/GETTEXT', methods: ['POST'])]
  public function GetFiles(Request $request) : Response
  {
    $source = (string)$request->get('currentSource');
    $model = new LibraryModel();
    $files = $model->GetFiles($source);
    $response = new Response(json_encode($files));
    $response->headers->set('Content-Type', 'application/json');
    return $response;
  }

  #[Route('/GETCHAPTER', methods: ['POST'])]
  public function GetChapter(Request $request)
  {
    $source = (string)$request->get('currentSource');
    $index = (int)$request->get('index');
    $total = (int)$request->get('total');

    $model = new LibraryModel();
    $chapter = $model->GetChapter($source, $index);

    // $response = new Response(json_encode([$index, $total]));
    $response = new Response(json_encode([$chapter, $index]));
    $response->headers->set('Content-Type', 'application/json');
    return $response;
  }

  #[Route('/LASTCHAPTER', methods: ['POST'])]
  function LastChapter(Request $request)
  {
    $source = (string)$request->get('currentSource');
    $index = (int)$request->get('index');
    $total = (int)$request->get('total');

    if($index > 0) $index--;

    $model = new LibraryModel();
    $chapter = $model->GetChapter($source, $index);

    $response = new Response(json_encode([$chapter, $index]));
    $response->headers->set('Content-Type', 'application/json');
    return $response;
  }

  #[Route('/NEXTCHAPTER', methods: ['POST'])]
  function NextChapter(Request $request)
  {
    $source = (string)$request->get('currentSource');
    $index = (int)$request->get('index');
    $total = (int)$request->get('total');

    if($index < $total) $index++;

    $model = new LibraryModel();
    $chapter = $model->GetChapter($source, $index);

    $response = new Response(json_encode([$chapter, $index]));
    $response->headers->set('Content-Type', 'application/json');
    return $response;
  }
}