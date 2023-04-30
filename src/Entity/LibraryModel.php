<?php

declare(strict_types=1);

namespace App\Entity;

use Doctrine\DBAL\Connection;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Finder\Finder;

class LibraryModel extends AbstractController
{
    public function GetLinks(Connection $connection): array
    {
      $links = $connection->fetchAllAssociative('SELECT * FROM library_links ORDER BY title ASC');
      $genres = $connection->fetchAllAssociative('SELECT DISTINCT genre FROM library_links ORDER BY genre ASC');
      $authors = $connection->fetchAllAssociative('SELECT DISTINCT author FROM library_links ORDER BY author ASC');
      return [$links, $genres, $authors];
    }

    public function GetFiles(string $source)
    {
      $volumes = [];
      $chapters = [];
      $finder = new Finder();
      $finder->files()->in(__DIR__ . 'src/' . $source);
      $finder->sortByName();

      foreach ($finder as $file) {
        $filePath = $file->getPathname();
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
      $finder = new Finder();
      $finder->files()->in(__DIR__ . 'src/' . $source);
      $finder->sortByName();

      $counter = 0;

      foreach ($finder as $file) {
        if($counter !== $index)
        {
          $counter++;
          continue;
        }
        $text = $file->getContents();
        $text = str_replace("_", '', $text);
        $text = str_replace("*", '', $text);
        $formattedText = str_replace("\n", ' ', $text);
        $formattedText = str_replace("\r", ' ', $formattedText);
        return [$text, $formattedText];
    }
    }
}