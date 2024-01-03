using System.Security.Cryptography;
using System.Text;

namespace FIT_Api_Examples.Helper
{
    public class TokenGenerator
    {
        public static string Generate(int size)
        { 
            var charSet = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
            var chars = charSet.ToCharArray();
            var data = new byte[1];
#pragma warning disable SYSLIB0023
            var crypto = new RNGCryptoServiceProvider();
#pragma warning restore SYSLIB0023
            crypto.GetNonZeroBytes(data);
            data = new byte[size];
            crypto.GetNonZeroBytes(data);
            var result = new StringBuilder(size);
            foreach (var b in data)
            {
                result.Append(chars[b % (chars.Length)]);
            }
            return result.ToString();
        }

        public static string GenerisiIme(int size)
        {
            var charSet = "ABCDEFGHJKLMNPQRSTUVWXYZ".ToLower();
            var chars = charSet.ToCharArray();
            var data = new byte[1];
#pragma warning disable SYSLIB0023
            var crypto = new RNGCryptoServiceProvider();
#pragma warning restore SYSLIB0023
            crypto.GetNonZeroBytes(data);
            data = new byte[size];
            crypto.GetNonZeroBytes(data);
            var result = new StringBuilder(size);
            foreach (var b in data)
            {
                result.Append(chars[b % (chars.Length)]);
            }
            var s =result.ToString();
            return "S" + result;
        }
    }
}