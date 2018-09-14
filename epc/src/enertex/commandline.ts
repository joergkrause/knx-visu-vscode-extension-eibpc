const exec = require('child_process').exec;

// nconf.exe
const nconf =
  'C:/Users/joerg/OneDrive/Dokumente/Privates/Haus/EFH/EibStudio/EibstudioData/nconf -Y 192.168.0.12';

/**
 * 
 * nconf v3.100
    ============

    Netzwerk:
        IP-Adresse per Broadcast abfragen:
            nconf -p [Portnummer von nconf (optional)]
        Netzwerkeinstellungen per Broadcast uebertragen:
            nconf -n [IP-Adresse] [Netzmaske] [Gateway] [Portnummer von nconf (optional)] oder
            nconf -n dhcp [Portnummer von nconf (optional)]
        Netzwerkeinstellungen per Broadcast zuruecksetzen:
            nconf -r [Portnummer von nconf (optional)]
        DNS-Server einstellen:
            nconf -d [IP-Adresse des DNS-Servers] [IP-Adresse des EibPCs] [Portnummer von nconf (optional)]
        DNS-Server pruefen (kann bis zu 10s dauern):
            nconf -f [IP-Adresse des EibPCs] [Portnummer von nconf (optional)]
    Zeitzone:
        Zeitzone auslesen:
            nconf -z0 [IP-Adresse] [Portnummer von nconf (optional)]
        Zeitzone einstellen:
            nconf -s0 [Zeitzone] [IP-Adresse] [Portnummer von nconf (optional)]
        Datum und Uhrzeit auslesen:
            nconf -z1 [IP-Adresse] [Portnummer von nconf (optional)]
        Datum und Uhrzeit einstellen:
            nconf -s1 [YYYY:MM:DD] [hh:mm:ss] [Sommerzeit: 1 | 0 | -1] [IP-Adresse] [Portnummer von nconf (optional)]
        NTP-Status auslesen:
            nconf -z4 [IP-Adresse] [Portnummer von nconf (optional)]
        NTP-Peers vorgeben:
            nconf -s4 [IP-Adresse Peer 1] [IP-Adresse Peer 2 (optional)] ... [IP-Adresse Peer 10 (optional)] [IP-Adresse] [Portnummer von nconf (optional)]
        Zeitsynchronisierung abbrechen:
            nconf -X [IP-Adresse] [Portnummer von nconf (optional)]
    Objekte:
        Zustandsspeicher eines Objekts abfragen:
            nconf -q [Objektindex] [IP-Adresse] [Portnummer von nconf (optional)]
        Zustandsspeicher eines Objekts setzen:
            nconf -v [Objektindex] [Nutzdaten in ASCII-Hexadezimal-Format aabb... | float16:Nutzdaten als Fliesskommazahl | float32:Nutzdaten als Fliesskommazahl] [IP-Adresse] [Portnummer von nconf (optional)]
        Zustandsspeicher eines Objekts aus Puffer setzen:
            nconf -V [Objektindex] [IP-Adresse] [Portnummer von nconf (optional)]
        Verzeichnis ueber gespeicherte Objekte oder Zeitpuffer erstellen:
            nconf -F [IP-Adresse] [Portnummer von nconf (optional)]
    KNX-Telegramme:
        KNX-Telegramm(e) aus einer Datei abrufen:
            nconf -T [Datei]
        KNX-Telegramm(e) aus dem Langzeitpuffer abrufen:
            nconf -g [IP-Adresse] [Portnummer von nconf (optional)]
        Alle KNX-Telegramme im Langzeitpuffer loeschen:
            nconf -l [IP-Adresse] [Portnummer von nconf (optional)]
        Anzahl der KNX-Telegramm(e) im Langzeitpuffer abrufen:
            nconf -b [IP-Adresse] [Portnummer von nconf (optional)]
        KNX-Telegramm(e) aus dem Kurzzeitpuffer abrufen:
            nconf -t [IP-Adresse] [Portnummer von nconf (optional)]
        Leseanforderung an Gruppenadresse eines Objekts erstellen:
            nconf -j [Objektindex] [IP-Adresse] [Portnummer von nconf (optional)]
        Schreibanforderung an Gruppenadresse eines Objekts erstellen:
            nconf -o [Objektindex] [Nutzdaten in ASCII-Hexadezimal-Format aabb... | float16:Nutzdaten als Fliesskommazahl] [IP-Adresse] [Portnummer von nconf (optional)]
    Szenen:
        Gespeicherte Szenen loeschen:
            nconf -a [IP-Adresse] [Portnummer von nconf (optional)]
        Verzeichnis ueber gespeicherte Szenen erstellen:
            nconf -B [IP-Adresse] [Portnummer von nconf (optional)]
    Hardware:
        Geraet neu starten:
            nconf -h [IP-Adresse] [Portnummer von nconf (optional)]
        Zustand der KNXnet/IP-Anbindung auslesen:
            nconf -z2 [IP-Adresse] [Portnummer von nconf (optional)]
        KNXnet/IP-Anbindung trennen oder aufbauen:
            nconf -s2 [trennen: 0 / aufbauen: 1] [IP-Adresse] [Portnummer von nconf (optional)]
    Firmware:
        Firmwareversion, Seriennummer, Netzwerkeinstellungen und weitere Informationen abrufen:
            nconf -i [IP-Adresse] [Portnummer von nconf (optional)]
        Firmwareversion abrufen:
            nconf -Y [IP-Adresse] [Portnummer von nconf (optional)]
        Firmware aktualisieren:
            nconf -u [Firmware] [IP-Adresse] [Portnummer von nconf (optional)]
        Freischaltcode uebertragen:
            nconf -m [Freischaltcode] [IP-Adresse] [Portnummer von nconf (optional)]
        Freigeschaltete Funktionen abrufen:
            nconf -w [IP-Adresse] [Portnummer von nconf (optional)]
        Patch uebertragen:
            nconf -y [Patch] [IP-Adresse] [Portnummer von nconf (optional)]
    Fehlerspeicher:
        Fehlerspeicher des EibPCs auslesen:
            nconf -e [IP-Adresse] [Portnummer von nconf (optional)]
        Fehlerspeicher des EibPCs als Text auslesen:
            nconf -E [IP-Adresse] [Portnummer von nconf (optional)]
    Programm:
        Programm uebertragen:
            nconf -c [Programm] [IP-Adresse] [Portnummer von nconf (optional)]
        Programm beenden (wird automatisch neu gestartet):
            nconf -k [IP-Adresse] [Portnummer von nconf (optional)]
        Status der Programmausfuehrung abfragen:
            nconf -S [IP-Adresse] [Portnummer von nconf (optional)]
    Schnittstelle:
        KNXnet/IP-Schnittstellen suchen:
            nconf -z3 [IP-Adresse des EibPCs] [Portnummer von nconf (optional)]
    Dateien:
        Benutzerdefinierte Datei lesen:
            nconf -R [Dateiname (lokal)] [Dateiname (EibPC)] [IP-Adresse des EibPCs] [Portnummer von nconf (optional)]
        Benutzerdefinierte Datei schreiben:
            nconf -W [Dateiname (lokal)] [Dateiname (EibPC)] [IP-Adresse des EibPCs] [Portnummer von nconf (optional)]
        Benutzerdefinierte Datei loeschen:
            nconf -H [Dateiname (EibPC)] [IP-Adresse des EibPCs] [Portnummer von nconf (optional)]
        Groesse einer benutzerdefinierten Datei ermitteln:
            nconf -I [Dateiname (EibPC)] [IP-Adresse des EibPCs] [Portnummer von nconf (optional)]
    VPN:
        Zertifikat abfragen:
            nconf -A [IP-Adresse des EibPCs] [Portnummer von nconf (optional)]
        Zertifikat erstellen:
            nconf -C [IP-Adresse des EibPCs] [Portnummer von nconf (optional)]
        Arbeitsverzeichnis anpassen
            nconf -D [Pfad] ... [weitere Optionen]
    Webserver:
        Verzeichnis ueber gespeicherte Bilder fuer den Webserver erstellen:
            nconf -G [IP-Adresse] [Portnummer von nconf (optional)]

 * 
 */

// eibparser.exe
const eibparser = `eibparser 
-f 192.168.0.61 
--ntpsync 0 
--language USA 
--config {\"C:/Users/joerg/OneDrive/Dokumente/Privates/Haus/EFH/EibStudio/EibstudioData/tmpApp.txt"} 
--output {\"C:/Users/joerg/OneDrive/Dokumente/Privates/Haus/EFH/EibStudio/EibstudioData/tmpConf.txt\"} 
--addresstable {\"C:/Users/joerg/OneDrive/Dokumente/Privates/Haus/EFH/EibStudio/EibstudioData/tmpAddr.txt\"} 
--eventlog {\"C:/Users/joerg/OneDrive/Dokumente/Privates/Haus/EFH/EibStudio/EibstudioData/tmpObjects.txt\"} 
--debugtable {\"C:/Users/joerg/OneDrive/Dokumente/Privates/Haus/EFH/EibStudio/EibstudioData/tmpDebug.txt\"} 
--macroout {\"C:/Users/joerg/OneDrive/Dokumente/Privates/Haus/EFH/EibStudio/EibstudioData/tmpMacroOut.txt\"} 
--timeout 142 
-t {\"C:/Users/joerg/OneDrive/Dokumente/Privates/Haus/EFH/EibStudio/EibstudioData/tmpAssign.txt\"} 
--macrofuncout {\"C:/Users/joerg/OneDrive/Dokumente/Privates/Haus/EFH/EibStudio/EibstudioData/tmpMacroFuncOut.txt\"} 
--streamout {\"C:/Users/joerg/OneDrive/Dokumente/Privates/Haus/EFH/EibStudio/EibstudioData/tmpCompilerOut.txt\"}`;

/**
 *    +---+ EibParser  - v3.201 (Windows Win32 Version) +---+

 Gebrauch: eibparser -c File [Options]
            eibparser -h help info

--config ist die *.epc Datei

Alle anderen werden durch den Lauf erzeugt und beinhalten die Ergebnisse. Diese nutzt nconf zur Übertragung.

 EibParser wurde ohne Fehler beendet.

 (c) 2008-2016 Enertex Bayern GmbH
 www.enertex.de
 * 
 */

export class EnertexCLIs {
  public static nconf = "nconf.exe";
  public static eibparser = "eibparser.exe";
}

export class ExecuteShell {
  execute(command, callback) {
    exec(command, function(error, stdout, stderr) {
      if (error){
        console.log('stderr: ' + stderr);
      }
      callback(stdout);
    });
  }
}
