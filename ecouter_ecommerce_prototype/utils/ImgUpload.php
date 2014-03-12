<?php
class ImgUpload {
	
	public function createThumbnail($pFilename) {  
		require 'upload_config.php';
	     if(preg_match('/[.](jpg)$/', $pFilename)) {  
	         $im = imagecreatefromjpeg($path_to_image_directory . $pFilename);  
	     } else if (preg_match('/[.](gif)$/', $pFilename)) {  
	         $im = imagecreatefromgif($path_to_image_directory . $pFilename);  
	     } else if (preg_match('/[.](png)$/', $pFilename)) {  
	         $im = imagecreatefrompng($path_to_image_directory . $pFilename);  
	     }  
	   
	     $ox = imagesx($im);  
	     $oy = imagesy($im);  
	   
	     $nx = $final_width_of_image;  
	     $ny = floor($oy * ($final_width_of_image / $ox));  
	   
	     $nm = imagecreatetruecolor($nx, $ny);  
	   
	     imagecopyresized($nm, $im, 0,0,0,0,$nx,$ny,$ox,$oy);  
	   
	     if(!file_exists($path_to_thumbs_directory)) {  
	       if(!mkdir($path_to_thumbs_directory)) {  
	            die("There was a problem. Please try again!");  
	       }  
	        }  
	   
	     imagejpeg($nm, $path_to_thumbs_directory . $pFilename);  
	     $tn = '<img src="' . $path_to_thumbs_directory . $pFilename . '" alt="image" />';  
	     $tn .= '<br />Congratulations. Your file has been successfully uploaded, and a thumbnail has been created.';  
	     echo $tn;  
	 } 
}
?>