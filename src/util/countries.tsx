"use client";
import { Mutex } from "async-mutex";
import { FC, SVGProps, useEffect, useState } from "react";


type CountryName = "kyrgyzstan" | "china";

let countriesMap: {[key in CountryName]: CountryPath} | null = null;
const loading = new Mutex();

type CountryPath = {
    name: string,
    transform?: string,
    paths: string[]
};

const loadCountries = async () => {
    await loading.runExclusive(async () => {
        if(countriesMap)
            return;

        const resp = await fetch("/countries.json");
        const r: CountryPath[] = await resp.json();

        countriesMap = Object.fromEntries(r.map(country => {
            return [country.name, country];
        })) as any;
    });
};

const getCountry = async (name: CountryName): Promise<CountryPath> => {
    if(!countriesMap)
        await loadCountries();

    return countriesMap![name];
};


export const Country: FC<{name: CountryName} & SVGProps<SVGPathElement>> = (p) => {
    const [c, setCountry] = useState<null | CountryPath>(null);
    const props: SVGProps<SVGPathElement> = {...p};

    useEffect(() => {
        getCountry(p.name).then(coun => setCountry(coun));
    }, []);
    
    if(!c)
        return <></>;

    return <g transform={c.transform}>
        {c.paths.map((p, i) => {
            return <path key={i} {...props} data-title={`${c.name}_${i}`} d={p} />;
        })}
    </g>;
}