<?php

declare(strict_types=1);

namespace App\Controller;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Csrf\CsrfTokenManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;

use App\Entity\LibraryModel;

class LibraryController extends AbstractController
{
  /**
   * @Route("/", methods={"GET"})
  */
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

  /**
   * @Route("/test", methods={"GET"})
  */
  public function TestPage(Request $request) : Response
  {
    return $this->render('test.html.twig', [
    ]);
  }

  /**
   * @Route("/GETTEXT", methods={"POST"})
  */
  public function GetFiles(CsrfTokenManagerInterface $csrfTokenManager, Request $request) : Response
  {
    $submittedToken = $request->headers->get('X-CSRF-TOKEN');
    if ($this->isCsrfTokenValid('delete-item', $submittedToken)){
        return new JsonResponse(['error' => 'Invalid CSRF token'], 400);
    }
    
    $source = (string)$request->get('currentSource');
    $model = new LibraryModel();
    $files = $model->GetFiles($source);
    $response = new Response(json_encode($files));
    $response->headers->set('Content-Type', 'application/json');
    return $response;
  }

  /**
   * @Route("/GETCHAPTER", methods={"POST"})
  */
  public function GetChapter(CsrfTokenManagerInterface $csrfTokenManager, Request $request) : Response
  {
    $submittedToken = $request->headers->get('X-CSRF-TOKEN');
    if ($this->isCsrfTokenValid('delete-item', $submittedToken)){
        return new JsonResponse(['error' => 'Invalid CSRF token'], 400);
    }

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

  /**
   * @Route("/LASTCHAPTER", methods={"POST"})
  */
  function LastChapter(CsrfTokenManagerInterface $csrfTokenManager, Request $request) : Response
  {
    $submittedToken = $request->headers->get('X-CSRF-TOKEN');
    if ($this->isCsrfTokenValid('delete-item', $submittedToken)){
        return new JsonResponse(['error' => 'Invalid CSRF token'], 400);
    }

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

  /**
   * @Route("/NEXTCHAPTER", methods={"POST"})
  */
  function NextChapter(CsrfTokenManagerInterface $csrfTokenManager, Request $request) : Response
  {
    $submittedToken = $request->headers->get('X-CSRF-TOKEN');
    if ($this->isCsrfTokenValid('delete-item', $submittedToken)){
        return new JsonResponse(['error' => 'Invalid CSRF token'], 400);
    }

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