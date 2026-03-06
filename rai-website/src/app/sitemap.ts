import { MetadataRoute } from 'next';

const BASE = 'https://rai.jnnce.ac.in';

export default function sitemap(): MetadataRoute.Sitemap {
    const staticRoutes = [
        '/', '/faculty', '/research', '/notices', '/gallery',
        '/placements', '/alumni', '/achievements', '/labs',
    ];

    return staticRoutes.map(route => ({
        url: `${BASE}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '/' ? 'daily' : 'weekly',
        priority: route === '/' ? 1 : 0.8,
    }));
}
