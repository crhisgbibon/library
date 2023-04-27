<?php

declare(strict_types=1);

namespace App\Controller;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class LibraryController extends AbstractController
{
  #[Route('/', methods: ['GET', 'POST'])]
  public function index(): Response
  {
    return $this->render('library.html.twig', [
      'links' => [],
      'genres' => [],
      'authors' => [],
    ]);
  }

  public function index1(Request $request)
  {
    $model = new ModelLibrary();
    $result = $model->GetLinks();
    return view('Library.library', [
      'links' => $result[0],
      'genres' => $result[1],
      'authors' => $result[2],
    ]);
  }

  public function GetFiles(Request $request)
  {
    $source = (string)$request->currentSource;
    $model = new ModelLibrary();
    $files = $model->GetFiles($source);
    return $files;
  }

  public function GetChapter(Request $request)
  {
    $source = (string)$request->data[0];
    $index = (int)$request->data[1];
    $total = (int)$request->data[2];
    $model = new ModelLibrary();
    $chapter = $model->GetChapter($source, $index);
    return [$chapter, $index];
  }

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