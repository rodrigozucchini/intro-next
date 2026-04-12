import { cacheLife } from "next/cache";

export default async function RandomPage() {
    'use cache';
    cacheLife({
        stale: 5,
        revalidate: 10,
        //expire: 86400
    })

    const random = Math.random();
    const now = Date.now();
    const date = new Date();
    const uuid = crypto.randomUUID();
    const bytes = crypto.getRandomValues(new Uint8Array(16));

    return (
        <div>
            <p>{random}</p>
            <p>{now}</p>
            <p>{date.getTime()}</p>
            <p>{uuid}</p>
            <p>{bytes}</p>
        </div>
    )
}