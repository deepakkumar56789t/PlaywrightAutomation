class Solution:
    a=1+2j
    
    print(type(a))

    def mergeAlternately(self, word1: str, word2: str) -> str:
        res = []

        for a, b in zip(word1, word2):
            res.append(a)
            res.append(b)

        res.append(word1[len(word2):])
        res.append(word2[len(word1):])

        return "".join(res)