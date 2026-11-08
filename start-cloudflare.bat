@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Omega Res - Cloudflare

where node >nul 2>nul
if errorlevel 1 goto nonode

set "CF=cloudflared"
where cloudflared >nul 2>nul
if not errorlevel 1 goto havecf
set "CF=%ProgramFiles(x86)%\cloudflared\cloudflared.exe"
if exist "%CF%" goto havecf
set "CF=%ProgramFiles%\cloudflared\cloudflared.exe"
if exist "%CF%" goto havecf
goto nocf

:havecf
if not exist "data\tunnel-token.txt" goto notoken
set /p TUNNEL_TOKEN=<"data\tunnel-token.txt"
if "%TUNNEL_TOKEN%"=="" goto notoken

echo تشغيل Omega Res على الكمبيوتر...
start "Omega Res - Server" cmd /k node server.js
timeout /t 2 /nobreak >nul
echo تشغيل الاتصال بـ Cloudflare...
start "Omega Res - Cloudflare Tunnel" cmd /k ""%CF%" tunnel --no-autoupdate run"
echo.
echo تم التشغيل. اترك النافذتين مفتوحتين طول ما النظام شغال.
echo افتح النظام من الرابط الذي ربطته في Cloudflare.
echo.
pause
exit /b

:nonode
echo Node.js غير مثبت. حمّله من https://nodejs.org ثم أعد التشغيل.
pause
exit /b

:nocf
echo برنامج cloudflared غير مثبت.
echo افتح موجه الأوامر واكتب:
echo     winget install --id Cloudflare.cloudflared
echo ثم أعد تشغيل هذا الملف.
pause
exit /b

:notoken
echo لم يتم العثور على رمز الاتصال.
echo انسخ رمز النفق (Tunnel token) من Cloudflare والصقه وحده في الملف:
echo     data\tunnel-token.txt
echo ثم أعد تشغيل هذا الملف.
pause
exit /b
