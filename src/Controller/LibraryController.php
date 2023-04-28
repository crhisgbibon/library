<?php

declare(strict_types=1);

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
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

  #[Route('/', methods: ['POST'])]
  public function GetFiles(Request $request)
  {
    $source = (string)$request->currentSource;
    $model = new ModelLibrary();
    $files = $model->GetFiles($source);
    return $files;
  }

  #[Route('/', methods: ['POST'])]
  public function GetChapter(Request $request)
  {
    $source = (string)$request->data[0];
    $index = (int)$request->data[1];
    $total = (int)$request->data[2];
    $model = new ModelLibrary();
    $chapter = $model->GetChapter($source, $index);
    return [$chapter, $index];
  }

  #[Route('/', methods: ['POST'])]
  function LastChapter(Request $request)
  {
    $source = (string)$request->data[0];
    $index = (int)$request->data[1];
    $total = (int)$request->data[2];
    if($index > 0) $index--;
    $model = new ModelLibrary();
    $chapter = $model->GetChapter($source, $index);
    return [$chapter, $index];
  }

  #[Route('/', methods: ['POST'])]
  function NextChapter(Request $request)
  {
    $source = (string)$request->data[0];
    $index = (int)$request->data[1];
    $total = (int)$request->data[2];
    if($index < $total) $index++;
    $model = new ModelLibrary();
    $chapter = $model->GetChapter($source, $index);
    return [$chapter, $index];
  }
}