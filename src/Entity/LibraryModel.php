<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\DBAL\Connection;
use Symfony\Component\HttpFoundation\Response;

class LibraryModel
{
    public function index(Connection $connection): array
    {
        $users = $connection->fetchAllAssociative('SELECT * FROM users');

        // ...
    }

    public function GetLinks()
    {
      $links = DB::table("library_links")
      ->orderBy('title', 'asc')
      ->get();
      $genres = DB::table("library_links")
      ->orderBy('genre', 'asc')
      ->get();
      $authors = DB::table("library_links")
      ->orderBy('author', 'asc')
      ->get();
      return [$links, $genres, $authors];
    }

    public function GetFiles(string $source)
    {
      $volumes = [];
      $chapters = [];
      $fileList = Storage::files($source);
      foreach($fileList as $filePath)
      {
        $position = strrpos($filePath, "/", -1);
        $position++;
        $filenameWithExtension = substr($filePath, $position);
        $positionDot = strrpos($filenameWithExtension, ".", -1);
        $filename = substr($filenameWithExtension, 0, $positionDot);
        $positionDash = strrpos($filename, "-");
        $volume = substr($filename, 0, $positionDash);
        $positionDash++;
        $chapter = substr($filename, $positionDash);
        array_push($volumes, $volume);
        array_push($chapters, $chapter);
      }
      return [$volumes, $chapters];
    }

    public function GetChapter(string $source, int $index)
    {
      $fileList = Storage::files($source);
      $text = Storage::get($fileList[$index]);
      $text = str_replace("_", '', $text);
      $text = str_replace("*", '', $text);
      $formattedText = str_replace("\n", ' ', $text);
      $formattedText = str_replace("\r", ' ', $formattedText);
      return [$text, $formattedText];
    }
}