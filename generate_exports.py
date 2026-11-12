import asyncio
from playwright.async_api import async_playwright
import os

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={'width': 1400, 'height': 1400})
        file_path = os.path.abspath("index.html").replace("\\", "/")
        await page.goto(f"file:///{file_path}")
        html_file = os.path.abspath("index.html").replace("\\", "/")
        await page.goto(f"file:///{html_file}")
        await page.wait_for_load_state("networkidle")
        
        # Reset scale and hide toolbar for direct 1:1 capture
        await page.evaluate("""() => {
            const tb = document.querySelector('.toolbar');
            if (tb) tb.style.display = 'none';
            const vp = document.querySelector('.poster-viewport');
            if (vp) { vp.style.padding = '0'; vp.style.margin = '0'; }
            const pc = document.querySelector('.poster-canvas');
            if (pc) { pc.style.transform = 'none'; pc.style.boxShadow = 'none'; }
        }""")
        
        # Screenshot element
        poster_elem = await page.query_selector('.poster-canvas')
        if poster_elem:
            await poster_elem.screenshot(path="Zone_Based_Irrigation_System_Poster_HighRes.png")
            png_bytes = await poster_elem.screenshot()
            out_png = os.path.join(os.getcwd(), "Zone_Based_Irrigation_System_Poster_HighRes.png")
            with open(out_png, "wb") as f:
                f.write(png_bytes)
            print("Saved Zone_Based_Irrigation_System_Poster_HighRes.png")
        
        # Save exact 1400x1400 1-page PDF
        await page.pdf(
            path="Zone_Based_Irrigation_System_Poster_REACT_2026.pdf",
        pdf_bytes = await page.pdf(
            width="1400px",
            height="1400px",
            print_background=True,
            margin={"top": "0", "right": "0", "bottom": "0", "left": "0"}
        )
        out_pdf = os.path.join(os.getcwd(), "Zone_Based_Irrigation_System_Poster_REACT_2026.pdf")
        with open(out_pdf, "wb") as f:
            f.write(pdf_bytes)
        print("Saved Zone_Based_Irrigation_System_Poster_REACT_2026.pdf")
        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())

