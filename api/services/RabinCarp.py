class RabinCarp:
    def __init__(self, text, pattern_size):
        self.text = text
        self.patternSize = pattern_size
        self.base = 26
        self.window_start = 0
        self.window_end = 0
        self.mod = 5807
        self.hash = self.get_hash(text, pattern_size)

    def get_hash(self, text, pattern_size):
        hash_value = 0
        for i in range(0, pattern_size):
            try:
                hash_value += (ord(self.text[i]) - 96) * (self.base ** (pattern_size - i - 1)) % self.mod
            except:
                print("Warning: input text too small.")

        self.window_start = 0
        self.window_end = pattern_size

        return hash_value

    def next_window(self):
        if self.window_end <= len(self.text) - 1:
            self.hash -= (ord(self.text[self.window_start]) - 96) * self.base ** (self.patternSize - 1)
            self.hash *= self.base
            self.hash += ord(self.text[self.window_end]) - 96
            self.hash %= self.mod
            self.window_start += 1
            self.window_end += 1
            return True
        return False

    def current_window_text(self):
        return self.text[self.window_start:self.window_end]
