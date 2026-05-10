export const handleImageUpload = async (
  file: File,
  onProgress?: (event: { progress: number }) => void,
  abortSignal?: AbortSignal
): Promise<string> => {
  // Validate file
  if (!file) {
    throw new Error("No file provided")
  }

  if (file.size > 4 * 1024 * 1024) {
    throw new Error(
      `File size exceeds maximum allowed (${5 / (1024 * 1024)}MB)`
    )
  }

  // For demo/testing: Simulate upload progress. In production, replace the following code
  // with your own upload implementation.
  for (let progress = 0; progress <= 100; progress += 10) {
    if (abortSignal?.aborted) {
      throw new Error("Upload cancelled")
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
    onProgress?.({ progress })
  }

  return "/images/tiptap-ui-placeholder-image.jpg"
}
