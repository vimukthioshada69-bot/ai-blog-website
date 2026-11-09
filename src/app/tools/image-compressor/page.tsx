import type { Metadata } from 'next';
import ImageCompressor from '@/components/tools/ImageCompressor';
export const metadata: Metadata = {title:'Free Image Compressor Online | SYNAPSE AI', description:'Compress images online for free. Adjust quality, compare file sizes, and download JPEG or WebP files. Processing happens privately in your browser.', alternates:{canonical:'/tools/image-compressor'}};
export default function Page(){return <ImageCompressor/>}
