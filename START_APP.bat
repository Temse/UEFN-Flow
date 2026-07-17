@echo off
title UEFN Flow - Desktop Launcher
color 0b
cls

echo =======================================================================
echo                 UEFN FLOW - AUTOMATISCHER STARTER
echo =======================================================================
echo.
echo Dieses Skript startet UEFN Flow auf deinem PC.
echo.

:: 1. Pruefen ob Node.js installiert ist
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [HINWEIS] Node.js wurde auf deinem PC nicht gefunden!
    echo Node.js wird zwingend benoetigt, damit die App lokal gestartet werden kann.
    echo.
    set /p "installNode=Moechtest du, dass Node.js (v24.18.0 LTS) automatisch heruntergeladen und gestartet wird? [y/n]: "
    
    if /i "%installNode%"=="y" (
        echo.
        echo [INFO] Node.js-Installer wird heruntergeladen... Bitte warten...
        
        :: Verwende PowerShell, um die .msi-Datei direkt herunterzuladen
        powershell -Command "Invoke-WebRequest -Uri 'https://nodejs.org/dist/v24.18.0/node-v24.18.0-x64.msi' -OutFile '%TEMP%\node_install.msi'"
        
        if exist "%TEMP%\node_install.msi" (
            echo [INFO] Download erfolgreich! Der Installer wird jetzt gestartet...
            echo Bitte folge den Anweisungen im Setup-Fenster und klicke auf 'Weiter' / 'Installieren'.
            echo.
            
            :: Starte den MSI-Installer und warte, bis dieser fertig ist
            msiexec /i "%TEMP%\node_install.msi"
            
            echo.
            echo =======================================================================
            echo [WICHTIG] Installation abgeschlossen!
            echo Bitte schliesse JETZT dieses Terminal-Fenster und starte 'START_APP.bat' neu,
            echo damit Windows das neu installierte Node.js erkennt.
            echo =======================================================================
            echo.
            del "%TEMP%\node_install.msi" >nul 2>&1
            pause
            exit
        ) else (
            echo [FEHLER] Herunterladen fehlgeschlagen.
            echo Bitte lade es manuell herunter: https://nodejs.org/
            pause
            exit
        )
    ) else (
        echo.
        echo [INFO] Start abgebrochen. Bitte installiere Node.js manuell: https://nodejs.org/
        pause
        exit
    )
)

:: 2. Abhaengigkeiten installieren, falls nicht vorhanden
if not exist node_modules (
    echo [INFO] Installiere notwendige Pakete...
    echo Dies kann beim ersten Start 1-2 Minuten dauern. Bitte warten...
    echo.
    call npm install
)

:: 3. Anwendung bauen, falls 'dist' Ordner fehlt
if not exist dist (
    echo.
    echo [INFO] Baue die Anwendung...
    call npm run build
)

echo.
echo =======================================================================
echo [ERFOLG] UEFN Flow wird gestartet!
echo.
echo Die App wird gleich unter http://localhost:3000 geoeffnet...
echo Lass dieses Terminal-Fenster im Hintergrund offen, solange du arbeitest.
echo =======================================================================
echo.

:: Oeffne den Standardbrowser mit der App
start http://localhost:3000

:: Starte den lokalen Server im Entwicklungsmodus
call npm run dev

pause
