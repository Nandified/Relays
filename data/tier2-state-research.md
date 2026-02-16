# Tier 2 states – real estate licensee data availability (bulk download)

Goal: determine whether each state offers a **free bulk download** of real estate licensee data (CSV/Excel/open data portal), and provide the best available official URL(s).

> Notes:
> - “Bulk download” below means an official, no-pay, machine-downloadable dataset (CSV/Excel/Socrata/API export). If a state only supports a public lookup UI, it is marked **scrape-only**.
> - Some states offer **paid** lists/rosters (not counted as “free bulk”). Those are noted.

---

## Summary table

| State | Licensing body | Free bulk download? | Official URL(s) | Format | Est. record count |
|---|---|---:|---|---|---:|
| Pennsylvania | PA Department of State / State Real Estate Commission (via PALS) | **No (found)** | https://www.pals.pa.gov/ | Search UI | — |
| Ohio | OH Dept. of Commerce – Division of Real Estate & Professional Licensing | **Unknown/No (found)** | https://elicense3.com.ohio.gov/lookup/licenselookup.aspx (retiring notice) | Search UI | — |
| Georgia | Georgia Real Estate Commission (GREC) / GA Secretary of State Licensing | **No (found)** | https://sos.ga.gov/licensing-division-license-lookup | Search UI | — |
| North Carolina | North Carolina Real Estate Commission (NCREC) | **No (free); paid CSV lists available** | https://license.ncrec.gov/ncrec/oecgi3.exe/O4W_LIC_SEARCH_NEW | Search UI (paid CSV lists) | — |
| Virginia | VA DPOR – Real Estate Board / License Lookup | **No (found)** | https://www.dpor.virginia.gov/LicenseLookup | Search UI | — |
| New Jersey | NJ Dept. of Banking & Insurance (DOBI) – Real Estate Commission licensee search | **No (found)** | https://www-dobi.nj.gov/DOBI_LicSearch/recSearch.jsp | Search UI | — |
| Arizona | Arizona Department of Real Estate (ADRE) – Public Database | **YES** | https://services.azre.gov/PdbWeb/List/ViewLists (bulk CSV lists) | CSV downloads | **~222,450** individual real estate licenses (CSV) + ~7,153 entities |
| Colorado | CO DORA – Division of Professions & Occupations / CO Information Marketplace (CIM) | **YES** | https://data.colorado.gov/Regulations/Professional-and-Occupational-Licenses-in-Colorado/7s5z-vewr | Socrata dataset (CSV export + API) | **~1,567,699** rows in dataset (all professions) |
| Washington | WA Dept. of Licensing (DOL) | **No (found)** | https://professions.dol.wa.gov/s/license-lookup | Search UI | — |
| Massachusetts | MA Division of Professional Licensure / Board of Registration of Real Estate Brokers & Salespersons | **No (found)** | https://licensing.reg.state.ma.us/public/ | Search UI | — |
| Michigan | MI LARA – Bureau of Professional Licensing (MiPLUS/Accela reports) | **YES** (reports downloadable) | https://www.michigan.gov/lara/bureau-list/bpl/license-lists-and-reports | Excel/PDF report downloads | (Not published on page) |
| Maryland | MD Dept. of Labor – Maryland Real Estate Commission (MREC) | **No (found)** | https://www.dllr.state.md.us/cgi-bin/ElectronicLicensing/OP_search/OP_search.cgi?calling_app=RE::RE_qselect | Search UI | — |
| Tennessee | TN Dept. of Commerce & Insurance – Tennessee Real Estate Commission (TREC) | **No (found)** | https://verify.tn.gov/ | Search UI | — |

---

## State-by-state detail

### 1) Pennsylvania (DOS)
- **Licensing body:** Pennsylvania Department of State (DOS), Bureau of Professional & Occupational Affairs – State Real Estate Commission
- **Free bulk download:** **No (found)**
- **Official lookup URL:** https://www.pals.pa.gov/ (Pennsylvania Licensing System)
- **Format:** Search UI (web)
- **Record count:** Not provided

### 2) Ohio (Division of Real Estate)
- **Licensing body:** Ohio Department of Commerce – Division of Real Estate & Professional Licensing
- **Free bulk download:** **Unknown/No (found)** (only lookup portals located)
- **Official lookup URL(s):**
  - https://elicense3.com.ohio.gov/lookup/licenselookup.aspx (shows a retirement notice in search results)
- **Format:** Search UI (web)
- **Record count:** Not provided

### 3) Georgia (GREC)
- **Licensing body:** Georgia Real Estate Commission (GREC) (via GA Secretary of State Licensing)
- **Free bulk download:** **No (found)**
- **Official lookup URL:** https://sos.ga.gov/licensing-division-license-lookup
- **Format:** Search UI (web)
- **Record count:** Not provided

### 4) North Carolina (NCREC)
- **Licensing body:** North Carolina Real Estate Commission (NCREC)
- **Free bulk download:** **No (free)**; **paid CSV lists** available
- **Official lookup URL:** https://license.ncrec.gov/ncrec/oecgi3.exe/O4W_LIC_SEARCH_NEW
- **Bulk/list notes (paid):** NCREC support page indicates lists are delivered in **CSV** but are **$15/list** (not free): https://www.ncrec.gov/Support/Support
- **Format:** Search UI (web) / Paid CSV rosters
- **Record count:** Not provided

### 5) Virginia (DPOR)
- **Licensing body:** Virginia Department of Professional and Occupational Regulation (DPOR) – Real Estate Board
- **Free bulk download:** **No (found)**
- **Official lookup URL:** https://www.dpor.virginia.gov/LicenseLookup
- **Format:** Search UI (web)
- **Record count:** Not provided

### 6) New Jersey (NJ Real Estate Commission)
- **Licensing body:** New Jersey Department of Banking & Insurance (DOBI) – Real Estate Commission licensee search (public lookup)
- **Free bulk download:** **No (found)**
- **Official lookup URL:** https://www-dobi.nj.gov/DOBI_LicSearch/recSearch.jsp
- **Format:** Search UI (web)
- **Record count:** Not provided

### 7) Arizona (ADRE)
- **Licensing body:** Arizona Department of Real Estate (ADRE)
- **Free bulk download:** **YES**
- **Official bulk download index:** https://services.azre.gov/PdbWeb/List/ViewLists
- **Direct bulk download links (CSV):**
  - **Individual Licenses (List ID 1)**: https://services.azre.gov/PdbWeb/List/DownloadList/1
  - **Entity Licenses (List ID 2)**: https://services.azre.gov/PdbWeb/List/DownloadList/2
  - **Public Reports (List ID 4)**: https://services.azre.gov/PdbWeb/List/DownloadList/4
  - **Schools (List ID 5)**: https://services.azre.gov/PdbWeb/List/DownloadList/5
- **Format:** CSV (comma-delimited; headers included)
- **Estimated record count:**
  - Individual Licenses CSV line count: **222,451 lines** ≈ **222,450 records** (minus header)
  - Entity Licenses CSV line count: **7,154 lines** ≈ **7,153 records** (minus header)

### 8) Colorado (DORA)
- **Licensing body:** Colorado Department of Regulatory Agencies (DORA) – Division of Professions and Occupations (DPO); Real Estate licenses are part of DORA licensing
- **Free bulk download:** **YES** (via Colorado Information Marketplace)
- **Official notice pointing to CIM (bulk):**
  - DORA license lookup page explicitly says to use CIM for mass license verification information: https://apps2.colorado.gov/dora/licensing/lookup/licenselookup.aspx
- **Bulk dataset URL (Socrata):**
  - https://data.colorado.gov/Regulations/Professional-and-Occupational-Licenses-in-Colorado/7s5z-vewr
  - API endpoint base: https://data.colorado.gov/resource/7s5z-vewr.json
- **Format:** Socrata open data (CSV export + API)
- **Estimated record count:**
  - Socrata API count(*) returned **1,567,699** rows (dataset appears to include *all* professional/occupational licenses, not just real estate).

### 9) Washington (DOL)
- **Licensing body:** Washington State Department of Licensing (DOL)
- **Free bulk download:** **No (found)**
- **Official lookup URL:** https://professions.dol.wa.gov/s/license-lookup
- **Format:** Search UI (web)
- **Record count:** Not provided

### 10) Massachusetts (Board of Registration)
- **Licensing body:** Massachusetts Division of Professional Licensure – Board of Registration of Real Estate Brokers and Salespersons
- **Free bulk download:** **No (found)**
- **Official lookup/search URL:** https://licensing.reg.state.ma.us/public/
- **Format:** Search UI (web)
- **Record count:** Not provided

### 11) Michigan (LARA)
- **Licensing body:** Michigan Department of Licensing and Regulatory Affairs (LARA) – Bureau of Professional Licensing (MiPLUS)
- **Free bulk download:** **YES** (generated “FOIA-Real Estate Brokers/Salesperson List” report downloadable; site notes Excel/PDF)
- **Official bulk/report index:** https://www.michigan.gov/lara/bureau-list/bpl/license-lists-and-reports
- **Real estate specific report link (generates downloadable report):**
  - FOIA-Real Estate Brokers/Salesperson List: https://aca-prod.accela.com/MILARA/Report/ReportParameter.aspx?module=Licenses&reportID=32411&reportType=LINK_REPORT_LIST
- **Format:** Report download (Excel and/or PDF depending on report)
- **Estimated record count:** Not provided on index page (would need to run report and count rows)

### 12) Maryland (DLLR)
- **Licensing body:** Maryland Department of Labor (formerly DLLR) – Maryland Real Estate Commission (MREC)
- **Free bulk download:** **No (found)**
- **Official lookup URL:** https://www.dllr.state.md.us/cgi-bin/ElectronicLicensing/OP_search/OP_search.cgi?calling_app=RE::RE_qselect
- **Format:** Search UI (web)
- **Record count:** Not provided

### 13) Tennessee (TREC)
- **Licensing body:** Tennessee Department of Commerce & Insurance – Tennessee Real Estate Commission (TREC)
- **Free bulk download:** **No (found)**
- **Official lookup URL:** https://verify.tn.gov/
- **Format:** Search UI (web)
- **Record count:** Not provided
