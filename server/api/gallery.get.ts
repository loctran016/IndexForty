import { v2 as cloudinary } from 'cloudinary'

export interface CloudinaryPhoto {
  publicId: string
  folder: string
  tags: string[]
  format: string
  width: number
  height: number
  createdAt: string
}

export default defineEventHandler(async (): Promise<CloudinaryPhoto[]> => {
  const config = useRuntimeConfig()

  cloudinary.config({
    cloud_name: config.cloudinaryCloudName,
    api_key: config.cloudinaryApiKey,
    api_secret: config.cloudinaryApiSecret,
  })

  const photos: CloudinaryPhoto[] = []
  let nextCursor: string | undefined

  // Cloudinary's search caps at 500 per request, so page through with next_cursor
  do {
    const result = await cloudinary.search
      .expression('resource_type:image')
      .with_field('tags')
      .sort_by('public_id', 'asc')
      .max_results(500)
      .next_cursor(nextCursor)
      .execute()

    for (const r of result.resources) {
      photos.push({
        publicId: r.public_id,
        folder: r.folder || 'Uncategorized',
        tags: r.tags ?? [],
        format: r.format,
        width: r.width,
        height: r.height,
        createdAt: r.created_at,
      })
    }

    nextCursor = result.next_cursor
  } while (nextCursor)

  return photos
})
