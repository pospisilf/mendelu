<br />
<div align="center">
  <h3 align="center">Implementace steganografických algoritmů</h3>

  <p align="center">
    Závěrečný projekt kryptologie
    <br />
    <a href="https://is.mendelu.cz/auth/lide/clovek.pl?id=110723"><strong>Filip Pospíšil</strong></a>
    <br />
  </p>
</div>

## Popis řešení
Vytvořené řešení projektu umožňuje šifrování a následné dešifrování libovolného souboru do bitmapového obrázku. Podporovány jsou soubory typu BMP a PNG. Algoritmus využívá metodu nejméně významného bitu (Least Significant Bit). Tato metoda nahrazuje 1 až 2 nejméně významné bity bitmapového obrázku. Obrázek obsahuje nejméně tři kanály reprezentující barvy. Každý kanál odpovídá osmi bitům. Změna nejméně významného bitu každého kanálu způsobí téměř neznatelnou změnu ve výsledném obrázku a umožní zašifrovat 3 bity dat do jednoho pixelu. V případě využití šifrování do 2 nejméně významných bitů lze do každého pixelu zašifrovat 6 bitů. Při využití 2 LSB lze snadněji detekovat změny v obrázku.

### Algortimus šifrování
Nejdříve je nutné zpracovat vstupní data. Ta je nutné načíst a převést do binární podoby. 

Z délky binární podoby dat se určí prefix. Prefix má v implementaci fixní délků 4 bytů. Tímto prefixem je limitována maximální velikost zašifrovaných dat, která je (2^32)-1 = 4294967295 bitů, tedy ~ 536.9 MB. Tento limit je stejný bez ohledu na počet využitých LSB v algoritmu a považuji jej za dostatečný. Pro uchování takto velkého souboru by při užití 2 LSB bylo potřeba přibližně 716 milionu pixelů, tedy čtvercového obrázku o straně více než 26 tisíc pixelů. Při využití 1 LSB by takový čtverec musel mít stranu více než 38 tisíc pixelů. Případné rozšíření spočívá pouze v rozšíření prefixu. Celkový počet požadovaných pixelů v obrázku je tedy součtem prefixu a binární reprezentace souboru.

Následně se načte a zpracuje obrázek, který poslouží k uchování informace. Obrázek musí být bitmapový a podporovány jsou formáty PNG a BMP. Vstupní obrázek může využívat barevný model obsahující víc než tři kanály (například RGBA). V případě přítomnosti dalších kanálů jsou tyto kanály ignorovány a bity vkládány zpět v nezměněné podobě. Po zpracování vstupního obrázku je vypočtena kapacita pro zápis. V případě, že se snažíme do obrázku zapsat více dat než je kapacita, program se ukončí a navrací nám chybovou hlášku. Pokud se data do obrázku vlezou, program pokračuje dál.

Samotné maskování dat je řešeno pomocí cyklu, který se vykoná pro každý pixel původního obrázku. Výstupem každého takového cyklu je nový pixel, který může ale nemusí být oproti původnímu pixelu změněný. Tento pixel je následně uložen do datového pole obsahujícího nové pixely. Toto pole na konci algoritmu slouží jako zdroj dat pro vytvoření nového obrázku. 

Po projití všech pixelů je k dispozici pole se změněnými pixely. Z tohoto pole je sestaven nový obrázek, který je následně uložen ne předem stanovenou cestu.

## Požadavky
Ke spuštění je nutné mít k dispozici interpret Python 3 a nainstalovanou knihovnu pro zpracování obrazu Pillow. Knihovnu lze nainstalovat pomocí pip. 
  ```sh
  pip install -r requirements.txt
  ```

## Jednotkové testy
Součástí programu jsou jednotkové testy. Ty testují funkčnost jednotlivých částí, celku a i případů, kdy má běh programu skončit neúspěšně. Testovány jsou metody pro převod do a z binární podoby. Dále se testuje šifrování a dešifrování nejdříve za použití 1 LSB a následně za použití 2 LSB. Z případů, kdy má běh programu skončit neúspěšně se testuje šifrování a dešifrování za použití jiného počtu bitů (šifrování 1 bitem a dešifrování 2 bity a obráceně) a pokus o zašifrování příliš velkého souboru. 

Jednotkové testy lze pustit následovně: 
  ```sh
  python3 -m unittest test_steganography.py
  ```

## Příklady použití
Programu funguje v režimech `enrypt` a `decrypt`. Pro program i oba režimy lze vyvolat nápovědu pomocí přepínač `-h` či `--help` následovně:
  ```sh
  python3 steganography.py --help
  python3 steganography.py encrypt --help
  python3 steganography.py decrypt --help
  ```

### Šifrování

Režim šifrování přijímá čtyři vstupní parametry. Parametr `--file` udává cestu k souboru, který bude šifrován do obrázku. `--image` udává cestu k obrázku, do kterého bude soubor šifrován. `--output` definuje výstupní cestu změněného obrázku. Volitelný parametr `--lsb` umožňuje nastavit počet LSB použitých k šifrování. Jesliže parametr není použitý, probíhá kódování do 2 nejméně významných bitů. 

Pro potřeby otestování jsou soubory pro použití v `file` a `image` předchystané ve složce `examples.` 
  ```sh
  python3 steganography.py encrypt --file examples/input_file.txt --image examples/input_image.png --output examples/image_with_secret.png --lsb 2
  ```

### Dešifrování

Režim dešifrování přijímá tři vstupní parametry. Parametr `--file` udává cestu k obrázku, ze kterého bude dešifrovaný obsah. `--output` definuje výstupní cestu nově vzniklého souboru. Volitelný parametr `--lsb` umožňuje nastavit počet LSB použitých k dešifrování. Jesliže parametr není použitý, probíhá dekódování z 2 nejméně významných bitů. 

Pro otestování je nutné soubor nejdříve zašifrovat.
  ```sh
  python3 steganography.py decrypt --file examples/image_with_secret.png --output examples/original_file.txt --lsb 2
  ```