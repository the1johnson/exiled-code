<?php
require 'config.php';
require 'DbConnect.class.php';
die('Die In Place');
$DB = new DbConnect();
$handle = fopen("monsters.csv", "r");
$qVals = array();
$qOpts = array();
$sql = 'INSERT INTO Monsters (chapter,name,ace,what_see,appearance,points_total,armor,threshold,intelligence,spell_pyramid,strength,rips,rips_weak,weapons,dmg_oneh,dmg_twoh,carrier,offensive,defensive,vulnerabilities,skills,rank,creature_type) VALUES ';
$row = 0;
$table = '';
$table .= '<table>';
$table .= '<thead><tr><th>Chapter</th><th>Name</th><th>Approximate Character Equivilent (ACE)</th><th>What do I see?</th><th>Appearance Notes</th><th>Total Points</th><th>Armor</th><th>Threshold</th><th>Intelligence</th><th>Spell Pyramid</th><th>Strength Bonus</th><th>Rips From</th><th>Rips From When Weaknessed</th><th>Weapons and Claws</th><th>Damage Swing (If using One Handed Weapon)</th><th>Damage Swung (If using Two Handed Weapon)</th><th>Carrier</th><th>Offensive Abilities</th><th>Defensive Abilities</th><th>Vulnerabilities</th><th>Skills</th><th>Rank</th><th>Creature Type</th></tr></thead>';
$table .= '<tbody>';
while (($data = fgetcsv($handle, 500)) !== false){
    //error_log(print_r($data,1));
    if($row){
        $table .= '<tr>';
        $comma = '';
        $sql .= '(';
        foreach ($data as $value) {
            $sql .= $comma.'?';
            $qVals[] = empty($value) ? null : $value;
            $comma = ',';
            $table .= '<td>'.$value.'</td>';
        }
        $sql .= '),';
        $table .= '</tr>';
    }
    $row ++;
}
$table .= '</tbody>';
$table .= '</table>';
//error_log($sql);
//error_log(print_r($qVals,1));
echo $table;
//$moveInsertRes = $DB->query( rtrim($sql, ','), $qVals, $qOpts );
?>