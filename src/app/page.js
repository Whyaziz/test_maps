"use client";

import Image from "next/image";
import Maps from "./Maps/page";
import Geomaps from "./Geomaps/page";

export default function Home() {
    return (
        <main className="bg-green-700">
            <Geomaps />
        </main>
    );
}
